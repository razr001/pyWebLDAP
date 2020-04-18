const routes = {
  "/": {
    component: "/Home",
    model: ["home"]
  },
  "/ldap": {
    component: "/LDAPManage"
  },
  "/change": {
    component: "/ChangeUserPassword"
  },
  "/login": {
    component: "/Login"
  }
};

export default routes;
