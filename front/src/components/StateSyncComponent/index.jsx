import React from "react";
import PropTypes from "prop-types";

export default class StateSyncComponent extends React.PureComponent {
  static propTypes = {
    syncKey: PropTypes.string
  };

  static defaultProps = {
    syncKey: ""
  };

  constructor(props, context) {
    super(props, context);
    this.syncStates = [];
    this.syncName = this.constructor.name + props.syncKey;

    this.joinPageHandler = this.recvJoin.bind(this);
    this.syncHandler = this.onSetSync.bind(this);

    this.listenEvent();
  }

  componentWillUnmount() {
    this.removeEvent();
  }

  onSetSync(data) {
    if (data.syncName === this.syncName) {
      if (data.NO_STATE) {
        const rev = { ...data };
        delete rev.NO_STATE;
        this.recvSync(rev.syncData);
      } else {
        super.setState({
          ...data.syncData
        });
      }
    }
  }

  setState(updater, callback) {
    super.setState(updater, callback);
    const syncData = {};
    this.syncStates.forEach(key => {
      if (updater[key] !== undefined) {
        syncData[key] = updater[key];
      }
    });
    if (JSON.stringify(syncData) !== "{}") {
      // 同步数据
      eventer.emit("SEND_SYNC", {
        syncName: this.syncName,
        syncData
      });
    }
  }

  /**
   * 如果不想调setState单纯的同步数据可以调用这个方法
   * @param {*} data
   */
  sendSync(syncData) {
    eventer.emit("SEND_SYNC", {
      syncName: this.syncName,
      syncData,
      NO_STATE: true
    });
  }

  /**
   * 如果非setState的数据同步会回调这个方法
   * @param {*} data
   */
  // eslint-disable-next-line
  recvSync(data) {}

  /**
   * 页面连接信息发生变化时回调
   */
  // eslint-disable-next-line
  recvJoin(data) {}

  /**
   * 绑定要同步的对象属性
   * @param  {...any} params
   */
  bindSync(...params) {
    this.syncStates = params;
  }

  bindSyncName(syncName, ...params) {
    const { syncKey } = this.props;
    this.syncName = syncName + syncKey;
    this.syncStates = params;
  }

  /**
   * 监听数据同步事件
   */
  listenEvent() {
    eventer.addListener("RECV_JOIN", this.joinPageHandler);
    eventer.addListener("RECV_SYNC", this.syncHandler);
  }

  removeEvent() {
    eventer.removeListener("RECV_JOIN", this.joinPageHandler);
    eventer.removeListener("RECV_SYNC", this.syncHandler);
  }
}
