import * as services from "../services/user";

export default {
  namespace: "home",
  state: {
    list: [],
    total: 1
  },
  reducers: {
    setUserInfo(state, { data }) {
      return { ...state, ...data };
    }
  },
  effects: {
    *getUserInfo({ params }, { call, put }) {
      const { data } = yield call(services.getUserList, params);
      yield put({ type: "setUserInfo", data });
    }
  }
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     return history.listen(({ pathname, query }) => {
  //       if (pathname === '/home') {
  //         // dispatch({ type: 'getData', payload: query });
  //       }
  //     });
  //   },
  // },
};
