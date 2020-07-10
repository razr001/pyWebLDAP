import "@babel/polyfill";
// import React from "react";
import dva from "dva";
import { createBrowserHistory } from "history";
import "../resources/css/base.less";

const app = dva({
  history: createBrowserHistory()
});

app.router(require("../routes").default);
app.model(require("../models/global").default);

app.start("#root");

export default app._store; // eslint-disable-line
