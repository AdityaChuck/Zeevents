import create from "zustand";
import { devtools } from "zustand/middleware";

const ifLoggedInUser = JSON.parse(localStorage.getItem("user")) || {};
const loginTime = localStorage.getItem("loggedInTime")
  ? parseInt(localStorage.getItem("loggedInTime"))
  : 0;
export const useAuthStore = create(
  devtools((set) => ({
    authData: {
      userId: ifLoggedInUser.userId ? ifLoggedInUser.userId : "",
      token: ifLoggedInUser.token ? ifLoggedInUser.token : "",
      tokenExpiration: ifLoggedInUser.tokenExpiration
        ? ifLoggedInUser.tokenExpiration
        : 0,
    },
    loggedInAt: loginTime,
    login: (loginData) => {
      localStorage.setItem("loggedInTime", new Date().getTime().toString());
      localStorage.setItem("user", JSON.stringify(loginData));
      set({ authData: loginData, loggedInAt: new Date().getTime() });
    },
    logout: () => {
      localStorage.removeItem("loggedInTime");
      localStorage.removeItem("user");
      set({
        authData: {
          userId: "",
          token: "",
          tokenExpiration: 0,
        },
      });
    },
  }))
);
