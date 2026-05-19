import { atom, useRecoilState, useRecoilValue } from "recoil";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens
} from "utils/token";

const authState = atom({
  key: "authState",
  default: {
    isAuthenticated: false,
    user: null,
    initialized: false
  }
});

export function useAuth() {
  const [auth, setAuth] = useRecoilState(authState);

  const login = (accessToken, refreshToken, user) => {
    setTokens(accessToken, refreshToken);
    setAuth({
      isAuthenticated: true,
      user,
      initialized: true
    });
  };

  const logout = () => {
    clearTokens();
    setAuth({
      isAuthenticated: false,
      user: null,
      initialized: true
    });
  };

  const bootstrap = (user = null) => {
    const token = getAccessToken();
    setAuth({
      isAuthenticated: Boolean(token),
      user: token ? user : null,
      initialized: true
    });
  };

  const getStoredRefreshToken = () => getRefreshToken();

  return { auth, login, logout, bootstrap, getStoredRefreshToken };
}

export function useAuthValue() {
  return useRecoilValue(authState);
}
