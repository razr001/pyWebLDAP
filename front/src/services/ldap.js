import { get, post } from "../common/network";

export function connect(params) {
  return post("/ldap/connect", params);
}

export function fetchDN(params) {
  return get("/ldap/fetch/base", params);
}

export function getEntryTree() {
  return get("/ldap/entry/tree");
}

export function getEntryDetail(dn) {
  return get("/ldap/entry/info", { dn });
}

export function getObjectclasses() {
  return get("/ldap/objectclasses");
}

export function getObjectclassesAttr(name) {
  return get("/ldap/objectclass/attr", { name });
}

export function addEntry(params) {
  return post("/ldap/add/entry", params);
}

export function removeEntry(dn) {
  return post("/ldap/remove/entry", { dn });
}

export function moveEntry(params) {
  return post("/ldap/move/entry", params);
}

export function updateEntry(params) {
  return post("/ldap/update/entry", params);
}

export function changePassword(params) {
  return post("/ldap/change/user/password", params);
}
