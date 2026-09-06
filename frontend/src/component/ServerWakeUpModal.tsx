import React, { useMemo } from "react";
import { Check, RefreshCw } from "lucide-react";
import { useServerStore } from "../store/useServerStore";

export const ServerWakeUpModal: React.FC = () => {
  const {
    elapsedSeconds,
    estimatedTotalSeconds,
    isReadyTransitioning,
    manualRetry,
  } = useServerStore();

  // Progress capped at 95% until server returns 200 OK
  const progressPercent = isReadyTransitioning
    ? 100
    : Math.min(Math.round((elapsedSeconds / estimatedTotalSeconds) * 92), 95);

  // Friendly human status text
  const friendlyStatus = useMemo(() => {
    if (isReadyTransitioning) return "Server is live! Opening chat...";
    if (elapsedSeconds < 8) return "Connecting to server...";
    if (elapsedSeconds < 20) return "Waking up cloud container...";
    if (elapsedSeconds < 35) return "Starting services & database...";
    return "Almost ready...";
  }, [elapsedSeconds, isReadyTransitioning]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4">
      {/* Subtle warm red background glow */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-rose-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card: White & Red */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-red-100 shadow-2xl shadow-red-500/10 text-center flex flex-col items-center relative overflow-hidden">
        {/* Top Red Accent Strip */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/70 text-red-600 text-xs font-semibold tracking-wide mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span>Waking Up Server</span>
        </div>

        {/* Brand Icon Container in Soft Red Accent */}
        <div className="relative mb-5">
          <div className="size-20 rounded-2xl bg-gradient-to-b from-white to-red-50 border border-red-200/80 shadow-md shadow-red-500/10 flex items-center justify-center ring-4 ring-red-50/70 transition-all duration-300">
            {isReadyTransitioning ? (
              <div className="size-10 rounded-full bg-red-600 text-white flex items-center justify-center transition-transform duration-300 scale-110 shadow-sm">
                <Check className="size-6 stroke-[3]" />
              </div>
            ) : (
              <img
                src="/chaticon.png"
                alt="Chattify Logo"
                className="size-12 object-contain animate-pulse"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          {isReadyTransitioning ? "Welcome to Chattify!" : "Starting Chattify"}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">
          {isReadyTransitioning
            ? "Connection verified. Taking you to your chats..."
            : "Our free cloud server is waking up after being idle. This typically takes about 30–40 seconds."}
        </p>

        {/* Red Progress Bar */}
        <div className="w-full max-w-xs mt-6">
          <div className="w-full bg-red-50 border border-red-100 h-2 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isReadyTransitioning
                  ? "bg-red-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Status Text & Elapsed Seconds Badge */}
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-gray-600 font-medium flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-red-500 animate-ping" />
              {friendlyStatus}
            </span>
            <span className="font-mono font-bold text-red-700 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-md">
              {elapsedSeconds}s
            </span>
          </div>
        </div>

        {/* Retry Button */}
        {elapsedSeconds > 25 && !isReadyTransitioning && (
          <button
            type="button"
            onClick={manualRetry}
            className="mt-6 text-xs text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer hover:underline underline-offset-2"
          >
            <RefreshCw className="size-3 text-red-500" />
            <span>Taking a while? Tap to retry</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ServerWakeUpModal;
