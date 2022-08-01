import { useReducer, useEffect, createContext, useContext } from "react";
import Router from "next/router";
import { getFbAuth, getFb } from "config/firebase.config";
import { initialState, authReducer, RESET_AUTH_STATE } from "./auth.reducer";
import publicPages, { LOGIN_PAGE } from "components/auth/public-pages";

export const AuthContext = createContext();

export const AuthProvider = ({ children, appProps }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const client = localStorage.getItem("client");
    async function authListener() {
      const auth = await getFbAuth();
      return auth.onAuthStateChanged(async (user) => {
        if (user) {
          await resetAuthWithIdToken();
        } else {
          dispatch({
            type: RESET_AUTH_STATE,
            payload: {
              loading: false,
            },
          });
        }
      });
    }
    if (client) {
      authListener();
    }
  }, []);

  useEffect(() => {
    if (!state.loadingUser) {
      const path = appProps.router.route;
      if (!state.user && !publicPages.includes(path)) {
        Router.push(LOGIN_PAGE);
      } else if (state.isAuthenticated && path == LOGIN_PAGE) {
        Router.push("/dashboard");
      }
    }
  }, [state.user, state.loadingUser]);

  const hasRole = (role) => state.roles.includes(role);

  const extractRoles = (claims) =>
    Object.keys(claims).filter((claim) => claim.includes("ROLE_"));

  // Logout
  const logout = async () => {
    const auth = await getFbAuth();
    localStorage.clear();
    auth.signOut().then(() => {
      Router.push("/signin");
    });
  };

  const refreshToken = async () => {
    const auth = await getFbAuth();
    auth.currentUser
      .getIdToken(true)
      .then(async (idToken) => await resetAuthWithIdToken());
  };

  const getToken = async () => {
    const auth = await getFbAuth();
    return await auth.currentUser.getIdToken();
  };

  const resetAuthWithIdToken = async () => {
    const client = localStorage.getItem("client");

    const auth = await getFbAuth();
    auth.currentUser
      .getIdTokenResult()
      .then((idTokenResult) => {
        if (typeof idTokenResult.claims != undefined) {
          const roles = extractRoles(idTokenResult.claims);
          dispatch({
            type: RESET_AUTH_STATE,
            payload: {
              user: idTokenResult.claims,
              idToken: idTokenResult.token,
              roles,
              isSuper: roles.includes("ROLE_SUPER"),
              client,
            },
          });
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <AuthContext.Provider
      value={{
        logout,
        refreshToken,
        getToken,
        user: state.user,
        roles: state.roles,
        isSuper: state.isSuper,
        idToken: state.idToken,
        loadingUser: state.loadingUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);