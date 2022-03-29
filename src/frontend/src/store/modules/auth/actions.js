import { SET_ENTITY } from "@/store/mutation-types";

export async function login({ dispatch }, credentials) {
  const data = await this.$api.auth.login(credentials);
  this.$jwt.saveToken(data.token);
  this.$api.auth.setAuthHeader();
  dispatch("getMe");
}

export async function logout({ commit }, sendRequest = true) {
  if (sendRequest) {
    await this.$api.auth.logout();
  }
  this.$jwt.destroyToken();
  this.$api.auth.setAuthHeader();
  commit(
    SET_ENTITY,
    { module: "Auth", entity: "isAuthenticated", value: false },
    { root: true }
  );
  commit(
    SET_ENTITY,
    { module: "Auth", entity: "user", value: null },
    { root: true }
  );
}

export async function getMe({ commit, dispatch }) {
  try {
    const data = await this.$api.auth.getMe();
    commit(
      SET_ENTITY,
      { module: "Auth", entity: "isAuthenticated", value: true },
      { root: true }
    );
    commit(
      SET_ENTITY,
      { module: "Auth", entity: "user", value: data },
      { root: true }
    );
  } catch {
    // Note: in case of not proper login, i.e. token is expired
    dispatch("logout", false);
  }
}
