import React from "react";
// import PropTypes from "prop-types";
import { connect } from "dva";
import { Table } from "antd";
import styles from "./index.less";

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address"
  }
];

@connect(state => ({
  ...state.home
}))
export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "home/getUserInfo",
      params: {
        page: 1,
        pageSize: 20
      }
    });
  }

  render() {
    const { list, total } = this.props;
    return (
      <div className={styles.box}>
        <h2>
          共有
          {total}
          条数据
        </h2>
        <Table dataSource={list} columns={columns} rowKey="id" />
      </div>
    );
  }
}

Home.propTypes = {};
Home.defaultProps = {};
