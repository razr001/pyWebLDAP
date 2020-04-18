import { get } from "../common/network";

export function getUserList(params) {
  return get("/user/list", params);
}
