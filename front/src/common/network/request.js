import axios from "axios";
import { message } from "antd";

const API = "/api";

// const requrestKeys = {};

/**
 * 获取方法
 * @param originUrl
 * @param originOptions [options]
 * @return {Promise<T | void>}
 */
function request(originUrl, method = "get", params = {}, options = {}) {
  // const key = `${method}/${originUrl}/${JSON.stringify(params)}`;
  // if (requrestKeys[key]) {
  //   return Promise.reject(new Error(`重复请求${key}`));
  // }

  // requrestKeys[key] = 1;
  return new Promise((reslove, reject) => {
    return axios({
      method,
      url: `${API}${originUrl}`,
      params: method === "get" ? params : {},
      data: method !== "get" ? params : {},
      ...options
    })
      .catch(err => {
        // delete requrestKeys[key];
        reject(err);
      })
      .then(response => {
        if (response.data.code === 0) {
          return reslove(response.data.data);
        }
        message.error(response.data.data);
        if (response.data.code === 403) window.location.href = "/login";
        reject(response.data);
      });
  });
}

export default request;
