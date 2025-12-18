import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  profile_pic?: string;
  status?: "online" | "offline" | "away" | "busy";
  createdAt?: string;
}
interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface SendMessageData {
  id: string;
  text?: string;
  image?: string;
}

interface ProfileUpdateData {
  profile_pic?: string;
  username?: string;
}

interface ApiErrorResponse {
  message: string;
}


interface AuthState {
  // State
  AuthUser: User | null;
  isSignup: boolean;
  isLoginIn: boolean;
  isProfileUpdated: boolean;
  isprofileupdating: boolean;
  isCheckingAuth: boolean;
  isloggedout: boolean;
  messageUser: User[];
  currentChatuser: User | null;
  Chats: Message[];

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  update_profile: (profile_pic: ProfileUpdateData) => Promise<void>;
  getmsg: (id: string) => Promise<void>;
  getpeople: () => Promise<void>;
  sendmsg: (data: SendMessageData) => Promise<void>;
  Allchatdel: (id: string) => Promise<void>;
}


export const useAuthStore = create<AuthState>((set, get) => ({
  AuthUser: null,
  isSignup: false,
  isLoginIn: false,
  isProfileUpdated: false,
  isprofileupdating: false,
  isCheckingAuth: true,
  isloggedout: false,
  messageUser: [],
  currentChatuser: null,
  Chats: [],

  checkAuth: async () => {
    try {
      const res = await api.get<User>("/check");
      set({ AuthUser: res.data });
    } catch (error) {
      set({ AuthUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup
  signup: async (data: SignupData) => {
    set({ isSignup: true });
    try {
      const res = await api.post<User>("/signup", data);
      toast.success("Successfully Account Created!");
      set({ AuthUser: res.data });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSignup: false });
    }
  },

  // Login
  login: async (data: LoginData) => {
    set({ isLoginIn: true });
    try {
      const res = await api.post<User>("/login", data);
      toast.success("Successfully Logged in!");
      set({ AuthUser: res.data });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data?.message || "Login failed");
    } finally {
      set({ isLoginIn: false });
    }
  },

  // Logout
  logout: async () => {
    set({ isloggedout: true });
    try {
      await api.post("/logout");
      toast.success("Logout successfully");
      set({ AuthUser: null });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isloggedout: false });
    }
  },

  // Update Profile
  update_profile: async (profile_pic: ProfileUpdateData) => {
    set({ isprofileupdating: true });
    try {
      const res = await api.put<User>("/update-profile", profile_pic);
      toast.success("Profile successfully updated");
      set({ isProfileUpdated: true, AuthUser: res.data });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data?.message || "Profile update failed");
    } finally {
      set({ isprofileupdating: false });
    }
  },

  // Get Messages
  getmsg: async (id: string) => {
    try {
      const response = await api.get<{ messages: Message[] }>(`/message/getmsg/${id}`);
      const user = await api.get<User>(`/user/${id}`);
      set({ Chats: response.data.messages, currentChatuser: user.data });
    } catch (error) {
      console.log(error);
    }
  },

  // Get People/Users
  getpeople: async () => {
    try {
      const response = await api.get<{ message: User[] }>("/message/users");
      set({ messageUser: response.data.message });
    } catch (error) {
      console.log(error);
    }
  },
  sendmsg: async (data: SendMessageData) => {
    try {
      const response = await api.post<Message>(`/message/send/${data.id}`, {
        text: data.text,
        image: data.image,
      });
      const { Chats } = get();
      set({ Chats: [...Chats, response.data] });
    } catch (error) {
      console.log(error);
    }
  },

  // Delete All Chats
  Allchatdel: async (id: string) => {
    try {
      const response = await api.post(`/message/delchat/${id}`);
      // Fixed: axios doesn't have .ok property
      if (response.status === 200) {
        set({ Chats: [] });
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  },
}));