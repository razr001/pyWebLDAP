import React, { useState, useEffect } from "react";
import { Row, Col, Button, Tabs } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "src/services/auth";
import { disconnect } from "src/services/ldap";
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

  useEffect(() => {
    let connectionInfo = sessionStorage.getItem("connectionInfo");
    if (connectionInfo) {
      connectionInfo = JSON.parse(connectionInfo);
      setPanes([...connectionInfo.connections]);
      onTabChange(connectionInfo.activeKey);
    }
  }, []);

  // 缓存tabs信息
  useEffect(() => {
    sessionStorage.setItem(
      "connectionInfo",
      JSON.stringify({
        connections: panes,
        activeKey
      })
    );
  }, [panes, activeKey]);

  const onSelect = dn => {
    setSelectDN(dn);
  };

  const showAddConnect = () => {
    setAddConnectVisible(true);
  };

  const onConnect = connectData => {
    global.ldapId = connectData.id;
    setAddConnectVisible(false);
    const connect = panes.find(v => v.id === connectData.id);
    if (connect) {
      setActiveKey(`${connect.id}`);
    } else {
      panes.push(connectData);
      setPanes([...panes]);
      setActiveKey(`${connectData.id}`);
    }
  };

  const onCancel = () => {
    setAddConnectVisible(false);
  };

  const onTabChange = key => {
    setActiveKey(key);
    global.ldapId = parseInt(key, 10);
  };

  const onTabEdit = (targetKey, action) => {
    if (action === "remove") {
      const id = parseInt(targetKey, 10);
      const newPanes = panes.filter(v => v.id !== id);
      setPanes([...newPanes]);
      if (newPanes && newPanes.length > 0) {
        const newConnect = newPanes[newPanes.length - 1];
        global.ldapId = newConnect.id;
        setActiveKey(`${newConnect.id}`);
      } else {
        global.ldapId = "";
        setActiveKey("");
      }
      disconnect(id);
    }
  };

  const onLogout = () => {
    logout().then(() => {
      props.history.replace("/login");
    });
    sessionStorage.clear();
  };

  return (
    <div>
      <header className={styles.header}>
        <Button onClick={showAddConnect} type="link">
          Connections
        </Button>
        <Button
          onClick={onLogout}
          icon={<LogoutOutlined style={{ fontSize: "22px" }} />}
          type="link"
        />
      </header>
      <Tabs
        hideAdd
        onChange={onTabChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={onTabEdit}
        style={{ marginTop: "6px" }}
      >
        {panes.map(pane => (
          <TabPane tab={pane.host} key={`${pane.id}`} closable>
            <Row className={styles.box}>
              <Col flex="300px" style={{ overflow: "auto", height: "100%" }}>
                <section className={styles.treeBox}>
                  <EntryTree onSelect={onSelect} />
                </section>
              </Col>
              <Col flex="auto" style={{ overflow: "auto", height: "100%" }}>
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
