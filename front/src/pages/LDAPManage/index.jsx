import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "antd";
import EntryTree from "./EntryTree";
import EntryDetail from "./EntryDetail";
import AddConnectModal from "./AddConnectModal";
import styles from "./index.less";

const LDAPManage = props => {
  const [selectDN, setSelectDN] = useState();
  const [addConnectVisible, setAddConnectVisible] = useState(false);

  const onSelect = dn => {
    setSelectDN(dn);
  };

  const showAddConnect = () => {
    setAddConnectVisible(true);
  };

  const onConnect = connect => {
    console.log("-------------------------------", connect);
    setAddConnectVisible(false);
  };

  const onCancel = () => {
    setAddConnectVisible(false);
  };

  return (
    <Row className={styles.box}>
      <Col span={6}>
        <Button onClick={showAddConnect}>新建连接</Button>
        <section className={styles.treeBox}>
          <EntryTree onSelect={onSelect} />
        </section>
      </Col>
      <Col span={18}>
        <EntryDetail dn={selectDN} />
      </Col>
      <AddConnectModal
        visible={addConnectVisible}
        onCancel={onCancel}
        onConnect={onConnect}
      />
    </Row>
  );
};

export default LDAPManage;
