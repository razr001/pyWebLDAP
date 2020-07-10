import React, { useState, useEffect } from "react";
import { Table, Input, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  getEntryDetail,
  getObjectclassesAttr,
  updateEntry,
} from "src/services/ldap";
import CreatePasswordModal from "./CreatePasswordModal";
import styles from "./EntryDetail.less";

const EntryDetail = ({ dn }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState({});
  const [updateAttributes, setUpdateAttributes] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (!dn) return;
    setLoading(true);
    setUpdateAttributes({});
    setUpdateLoading({});
    // 获取明细数据
    getEntryDetail(dn)
      .then(data => {
        // 获取所有属性
        getObjectclassesAttr(data.attributes.objectClass.join())
          .then(attrs => {
            setLoading(false);
            const values = [];
            Object.keys(attrs).forEach(key => {
              values.push({
                attribute: key,
                isObjclass: true,
                value: ""
              });
              attrs[key].attribute.forEach(attrInfo => {
                values.push({
                  attribute: attrInfo.name,
                  value: data.attributes[attrInfo.name]
                    ? data.attributes[attrInfo.name].join()
                    : "",
                  required: attrInfo.required
                });
              });
            });
            setDataSource(values);
          })
          .catch(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dn]);

  const onEdit = attribute => {
    if (attribute === "userPassword") {
      setShowChangePassword(true);
      return;
    }

    updateAttributes[attribute] = true;
    setUpdateAttributes({ ...updateAttributes });
  };

  // const cancelEdit = attribute => {
  //   updateAttributes[attribute] = false;
  //   setUpdateAttributes({ ...updateAttributes });
  // };

  const onEditSubmit = (oldData, value) => {
    if (oldData.required && !value) {
      message.error(`${oldData.attribute} is require`);
      return;
    }
    const { attribute } = oldData;
    updateLoading[attribute] = true;
    setUpdateLoading({ ...updateLoading });

    updateEntry({
      dn,
      [attribute]: value
    })
      .then(() => {
        // eslint-disable-next-line no-param-reassign
        oldData.value = value;
        setDataSource([...dataSource]);

        updateLoading[attribute] = false;
        setUpdateLoading({ ...updateLoading });

        delete updateAttributes[attribute];
        setUpdateAttributes({ ...updateAttributes });
      })
      .catch(() => {
        updateLoading[attribute] = false;
        setUpdateLoading({ ...updateLoading });
      });
  };

  /**
   * 更新密码
   * @param {{password:'', encrypt:''}} value
   */
  const onUpdatePassword = value => {
    updateEntry({
      dn,
      userPassword: value.password ? value : { password: "", encrypt: "" }
    }).then(rel => {
      setShowChangePassword(false);
      // 更新界面上的密码
      for (const item of dataSource) {
        if (item.attribute === "userPassword") {
          item.value = rel.userPassword;
          setDataSource([...dataSource]);
          break;
        }
      }
    });
  };

  const columns = [
    {
      title: "Attribute",
      dataIndex: "attribute",
      key: "attribute",
      width: "30%",
      // eslint-disable-next-line react/display-name
      render: (text, data) => {
        if (data.isObjclass) {
          return {
            children: <div style={{ textAlign: "center" }}>[{text}]</div>,
            props: {
              colSpan: 3
            }
          };
        }
        return data.required ? <b>{text}</b> : text;
      }
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: "40%",
      // eslint-disable-next-line react/display-name
      render: (text, data) => {
        if (data.isObjclass) {
          return {
            children: text,
            props: {
              colSpan: 0
            }
          };
        }

        return (
          <div
            style={{ width: "100%", height: "100%" }}
            onDoubleClick={() => {
              onEdit(data.attribute, text);
            }}
            title="Double click to edit"
          >
            {updateAttributes[data.attribute] ? (
              <>
                <Input
                  disabled={dn.split(",", 1)[0] === `${data.attribute}=${text}`}
                  defaultValue={text}
                  onBlur={e => {
                    onEditSubmit(data, e.target.value);
                  }}
                  suffix={
                    updateLoading[data.attribute] ? <LoadingOutlined /> : null
                  }
                />
                {/* <a
                  style={{ marginLeft: "12px" }}
                  onClick={() => {
                    cancelEdit(data.attribute);
                  }}
                >
                  Cancel
                </a> */}
              </>
            ) : (
              text || (
                <span style={{ color: "#EBEBEB" }}>Double click to edit</span>
              )
            )}
          </div>
        );
      }
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "30%",
      render: (text, data) => {
        if (data.isObjclass) {
          return {
            children: text,
            props: {
              colSpan: 0
            }
          };
        }
        return text;
      }
    }
  ];

  return (
    <>
      <Table
        pagination={false}
        loading={loading}
        rowKey="attribute"
        dataSource={dataSource}
        columns={columns}
        rowClassName={record => {
          if (record.isObjclass) return styles.objectclassRow;
        }}
      />
      <CreatePasswordModal
        visible={showChangePassword}
        onOk={onUpdatePassword}
        onCancel={() => {
          setShowChangePassword(false);
        }}
      />
    </>
  );
};

export default EntryDetail;
