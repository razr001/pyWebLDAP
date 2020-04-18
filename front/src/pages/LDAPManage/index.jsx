import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import EntryTree from "./EntryTree";
import EntryDetail from "./EntryDetail";
import styles from "./index.less";

const LDAPManage = props => {
  const [selectDN, setSelectDN] = useState();

  const onSelect = dn => {
    setSelectDN(dn);
  };

  return (
    <Row className={styles.box}>
      <Col span={6}>
        <section className={styles.treeBox}>
          <EntryTree onSelect={onSelect} />
        </section>
      </Col>
      <Col span={18}>
        <EntryDetail dn={selectDN} />
      </Col>
    </Row>
  );
};

export default LDAPManage;
