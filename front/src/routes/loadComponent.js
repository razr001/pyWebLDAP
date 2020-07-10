import React from "react";
import Loadable from "react-loadable";
import { Spin } from "antd";

// 加载页面组件
const loadComponent = (app, component, models) => {
  return Loadable({
    loader: () => {
      return component()
        .then(raw => {
          loadModles(app, models);
          return raw.default || raw;
        })
        .catch(e => {
          throw e;
        });
    },
    // eslint-disable-next-line
    loading: () => {
      return <Spin />;
    }
  });
};

const modelNotExisted = (app, model) => {
  // eslint-disable-next-line
  return !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf("/") + 1);
  });
};

// 加载dva models
const loadModles = (app, models) => {
  if (models) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
  }
};

export default loadComponent;
