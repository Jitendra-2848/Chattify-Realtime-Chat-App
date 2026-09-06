import { create } from "zustand";
import { pingServerHealth } from "../lib/axios";

interface ServerState {
  isServerAwake: boolean;
  isWakingUp: boolean;
  shouldShowModal: boolean;
  elapsedSeconds: number;
  estimatedTotalSeconds: number;
  attemptCount: number;
  statusMessage: string;
  isReadyTransitioning: boolean;
  wakeUpServer: () => Promise<boolean>;
  manualRetry: () => void;
}

export const useServerStore = create<ServerState>((set, get) => {
  let timerInterval: any = null;
  let pollingTimeout: any = null;
  let coldStartDisplayTimeout: any = null;

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      set((state) => {
        const nextSec = state.elapsedSeconds + 1;
        let message = state.statusMessage;

        if (nextSec < 8) {
          message = "Pinging Render server container...";
        } else if (nextSec < 18) {
          message = "Waking up server instance (Cold Start)...";
        } else if (nextSec < 30) {
          message = "Initializing Node.js & Database connection...";
        } else if (nextSec < 45) {
          message = "Starting Socket services & API handlers...";
        } else {
          message = "Almost done! Waiting for container to respond...";
        }

        return {
          elapsedSeconds: nextSec,
          statusMessage: message,
        };
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  return {
    isServerAwake: false,
    isWakingUp: false,
    shouldShowModal: false,
    elapsedSeconds: 0,
    estimatedTotalSeconds: 40,
    attemptCount: 0,
    statusMessage: "Connecting to server...",
    isReadyTransitioning: false,

    wakeUpServer: async () => {
      if (get().isServerAwake) return true;

      set({ isWakingUp: true });

      // If server does not respond within 1.2s, it's a Render cold start: show modal and start timer
      coldStartDisplayTimeout = setTimeout(() => {
        if (!get().isServerAwake) {
          set({ shouldShowModal: true });
          startTimer();
        }
      }, 1200);

      const probe = async (): Promise<boolean> => {
        set((state) => ({ attemptCount: state.attemptCount + 1 }));

        try {
          const res = await pingServerHealth(8000);
          if (res.status === 200) {
            clearTimeout(coldStartDisplayTimeout);
            stopTimer();

            // If modal was shown, show celebration for 800ms
            if (get().shouldShowModal) {
              set({
                statusMessage: "Server is online & ready!",
                isReadyTransitioning: true,
              });
              await new Promise((resolve) => setTimeout(resolve, 800));
            }

            set({
              isServerAwake: true,
              isWakingUp: false,
              shouldShowModal: false,
              isReadyTransitioning: false,
            });
            return true;
          }
        } catch {
          // If probe fails immediately (e.g. 502/503 from Render), show modal immediately
          if (!get().shouldShowModal) {
            set({ shouldShowModal: true });
            startTimer();
          }
        }

        // Retry probe every 1 second at time of waking up
        return new Promise((resolve) => {
          pollingTimeout = setTimeout(async () => {
            const success = await probe();
            resolve(success);
          }, 1000);
        });
      };

      return await probe();
    },

    manualRetry: () => {
      if (pollingTimeout) clearTimeout(pollingTimeout);
      get().wakeUpServer();
    },
  };
});
