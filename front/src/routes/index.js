import React from "react";
import { Router, Route, Switch } from "dva/router";
import RouterLayout from "src/layout/RouterLayout";
import routes from "./routes";
import loadComponent from "./loadComponent";

function RouterConfig({ history, app }) {
  const pages = getRouterData(app);
  const paths = Object.keys(pages);
  return (
    <Router history={history}>
      <RouterLayout>
        <Switch>
          {paths.map(v => {
            const component = pages[v];
            return (
              <Route
                key={v}
                path={v}
                exact
                render={() => {
                  return createPage(history, component);
                }}
              />
            );
          })}
        </Switch>
      </RouterLayout>
    </Router>
  );
}

function createPage(history, compoent) {
  return React.createElement(compoent, { history });
}

function getRouterData(app) {
  const routeData = {};
  Object.keys(routes).forEach(v => {
    const route = routes[v];
    routeData[v] = loadComponent(
      app,
      () => import(`src/pages${route.component}`),
      route.model
    );
  });
  return routeData;
}

export default RouterConfig;
