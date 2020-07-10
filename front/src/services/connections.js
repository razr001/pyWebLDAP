import { get, post } from "../common/network";

export function addConnect(params) {
  return post("/connect/add", params);
}

export function updateConnect(params) {
  return post("/connect/update", params);
}

export function getConnections() {
  return get("/connect/list");
}

export function delConnect(id) {
  return post("/connect/del", { id });
}

export function testConnect(params) {
  return post("/connect/test", params);
}
