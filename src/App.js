import React, { useEffect } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import useSelectors from "./Util/hooks/selector";
import { useAuthStore } from "./store/AuthStore";

const App = () => {
  const logout = useAuthStore((state) => state.logout);
  const { loggedInAt, tokenExpiration } = useSelectors();

  useEffect(() => {
    if (
      tokenExpiration > 0 &&
      new Date().getTime() - loggedInAt > tokenExpiration * 60 * 60 * 1000
    ) {
      logout();
    } else {
      console.log(
        "Some time is remaining -> ",
        (tokenExpiration * 60 * 60 * 1000 -
          (new Date().getTime() - loggedInAt)) /
          (60 * 60 * 1000)
      );
    }
  }, [loggedInAt, logout, tokenExpiration]);

  return <Navigation />;
};

export default App;
