import React, { useState, useEffect } from "react";
import { Tree, Space, Popconfirm, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { getEntryTree, removeEntry, moveEntry } from "src/services/ldap";
import AddEntryModal from "./AddEntryModal";
import styles from "./EntryTree.less";

const { TreeNode } = Tree;

const EntryTree = ({ onSelect }) => {
  const [tree, setTree] = useState([]);
  useEffect(() => {
    getEntryData();
  }, []);

  const [selectedNode, setSelectNode] = useState();
  const [selectedDN, setSelectedDN] = useState();
  const [showAdd, setShowAdd] = useState(false);
  const [editEnable, setEditEnable] = useState(false);

  const getEntryData = () => {
    getEntryTree().then(data => {
      setTree(data);
    });
  };

  const treeNodeRender = treeData => {
    return treeData.map(v => {
      return (
        <TreeNode title={treeNodeTitle(v)} key={v.dn}>
          {v.children ? treeNodeRender(v.children) : null}
        </TreeNode>
      );
    });
  };

  const treeNodeTitle = data => {
    const title = data.dn.split(",", 1)[0];
    return (
      <div style={{ display: "flex" }}>
        <span>{title}</span>
        <span style={{ marginLeft: "16px" }}>
          {data.dn === selectedNode && (
            <Space>
              <a className={styles.opt} onClick={onAdd}>
                <PlusOutlined />
              </a>
              {/* <a className={styles.opt} onClick={onEdit}>
                <FormOutlined />
              </a> */}
              <Popconfirm
                title={
                  <div>
                    <div>Delete entry</div>
                    {data.dn}?
                  </div>
                }
                onConfirm={() => {
                  onRemove(data);
                }}
                // onCancel={cancel}
                okText="Ok"
                cancelText="Cancel"
              >
                <a className={styles.opt}>
                  <DeleteOutlined />
                </a>
              </Popconfirm>
            </Space>
          )}
        </span>
      </div>
    );
  };

  const onSelectNode = (selectedKeys, e) => {
    if (selectedKeys[0]) {
      setSelectNode(selectedKeys[0]);
      setSelectedDN(e.node.key);
      if (onSelect) {
        onSelect(e.node.key);
      }
    }
  };

  const onAdd = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setShowAdd(true);
  };

  const onEdit = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setShowAdd(true);
    setEditEnable(true);
  };

  const onRemove = data => {
    removeEntry(data.dn).then(() => {
      getEntryData();
    });
  };

  const onCancelAdd = () => {
    setShowAdd(false);
    setEditEnable(false);
  };

  const onOk = () => {
    if (editEnable) {
      // 编辑
    } else {
      message.success("新增成功");
      onCancelAdd();
      getEntryData();
    }
  };

  const onDrop = ({ node, dragNode }) => {
    const dn = dragNode.key;
    const targetDN = node.key;
    moveEntry({
      dn,
      targetDN
    }).then(() => {
      getEntryData();
    });
  };

  return (
    <React.Fragment>
      {tree[0] && (
        <Tree
          showLine
          showIcon
          draggable
          defaultExpandedKeys={[tree[0].dn]}
          onSelect={onSelectNode}
          selectedKeys={selectedNode ? [selectedNode] : []}
          onDrop={onDrop}
        >
          {treeNodeRender(tree)}
        </Tree>
      )}
      <AddEntryModal
        visible={showAdd}
        onCancel={onCancelAdd}
        onOk={onOk}
        targetDN={selectedDN}
        editEnable={editEnable}
      />
    </React.Fragment>
  );
};

export default EntryTree;
