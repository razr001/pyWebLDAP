import { post } from "../common/network";

export function login(params) {
  return post("/auth/login", params);
}

export function logout() {
  return post("/auth/logout");
}
