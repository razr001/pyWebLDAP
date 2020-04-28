import React, { useState, useEffect } from "react";
import { Row, Col, Button, Tabs } from "antd";
import EntryTree from "./EntryTree";
import EntryDetail from "./EntryDetail";
import AddConnectModal from "./AddConnectModal";
import styles from "./index.less";

const { TabPane } = Tabs;

const LDAPManage = props => {
  const [selectDN, setSelectDN] = useState();
  const [addConnectVisible, setAddConnectVisible] = useState(false);
  const [panes, setPanes] = useState([]);
  const [activeKey, setActiveKey] = useState("");

  const onSelect = dn => {
    setSelectDN(dn);
  };

  const showAddConnect = () => {
    setAddConnectVisible(true);
  };

  const onConnect = connectData => {
    global.ldapId = connectData.id;
    setAddConnectVisible(false);
    panes.push(connectData);
    setPanes([...panes]);
    setActiveKey(`${connectData.id}_${panes.length - 1}`);
  };

  const onCancel = () => {
    setAddConnectVisible(false);
  };

  const onTabChange = key => {
    setActiveKey(key);
    global.ldapId = parseInt(key.split("_")[0], 10);
  };

  return (
    <div>
      <Button onClick={showAddConnect}>新建连接</Button>
      <Tabs
        hideAdd
        onChange={onTabChange}
        activeKey={activeKey}
        type="editable-card"
        // onEdit={this.onEdit}
      >
        {panes.map((pane, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <TabPane tab={pane.host} key={`${pane.id}_${index}`} closable>
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
          </TabPane>
        ))}
      </Tabs>
      <AddConnectModal
        visible={addConnectVisible}
        onCancel={onCancel}
        onConnect={onConnect}
      />
    </div>
  );
};

export default LDAPManage;
