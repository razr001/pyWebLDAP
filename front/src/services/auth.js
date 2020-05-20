import { post, get } from "../common/network";

export function login(params) {
  return post("/auth/login", params);
}

export function logout() {
  return post("/auth/logout");
}

export function checkLogin() {
  return get("/auth/checkLogin");
}
