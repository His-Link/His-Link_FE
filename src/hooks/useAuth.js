import { atom, useRecoilState, useRecoilValue } from "recoil";
import { clearAccessToken, getAccessToken, setAccessToken } from "utils/token";

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

  const login = (token, user) => {
    setAccessToken(token);
    setAuth({
      isAuthenticated: true,
      user,
      initialized: true
    });
  };

  const logout = () => {
    clearAccessToken();
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

  return { auth, login, logout, bootstrap };
}

export function useAuthValue() {
  return useRecoilValue(authState);
}
