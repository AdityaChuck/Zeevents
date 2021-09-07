import { useCallback } from "react";
import { useAuthStore } from "../../store/AuthStore";
function useSelectors() {
  const authData = useAuthStore(useCallback((state) => state.authData, []));
  const loggedInAt = useAuthStore(useCallback((state) => state.loggedInAt, []));
  return {
    loggedInAt,
    userId: authData.userId,
    token: authData.token,
    tokenExpiration: authData.tokenExpiration,
    isLoggedIn:
      authData.userId !== "" &&
      authData.token !== "" &&
      authData.tokenExpiration !== 0,
  };
}
export default useSelectors;
