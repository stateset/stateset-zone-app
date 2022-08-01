export const RESET_AUTH_STATE = "RESET_AUTH_STATE";

export const initialState = {
  user: null,
  idToken: null,
  roles: null,
  isSuper: false,
  loadingUser: true,
  client: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case RESET_AUTH_STATE:
      return {
        ...state,
        user: action.payload.user ? action.payload.user : initialState.user,
        idToken: action.payload.idToken,
        roles: action.payload.roles,
        isSuper: action.payload.isSuper,
        loadingUser: false,
        client: action.payload.client
          ? action.payload.client
          : initialState.client,
      };
    default:
      return state;
  }
};