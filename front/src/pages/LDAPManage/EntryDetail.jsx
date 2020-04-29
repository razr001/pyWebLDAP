import React, { useState, useEffect } from "react";
import { Table, Input, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  getEntryDetail,
  getObjectclassesAttr,
  updateEntry,
} from "src/services/ldap";

const EntryDetail = ({ dn }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState({});
  const [updateAttributes, setUpdateAttributes] = useState({});

  useEffect(() => {
    if (!dn) return;
    setLoading(true);
    setUpdateAttributes({});
    setUpdateLoading({});
    getEntryDetail(dn)
      .then(data => {
        // 获取所有属性
        getObjectclassesAttr(data.attributes.objectClass.join())
          .then(attrs => {
            setLoading(false);
            const values = [];
            Object.keys(attrs).forEach(key => {
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
    updateAttributes[attribute] = true;
    setUpdateAttributes({ ...updateAttributes });
  };

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

  const columns = [
    {
      title: "Attribute",
      dataIndex: "attribute",
      key: "attribute",
      width: "30%",
      // eslint-disable-next-line react/display-name
      render: (text, data) => (data.required ? <b>{text}</b> : text)
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: "40%",
      // eslint-disable-next-line react/display-name
      render: (text, data) => {
        return (
          <div
            style={{ width: "100%", height: "100%" }}
            onDoubleClick={() => {
              onEdit(data.attribute, text);
            }}
            title="Double click edit"
          >
            {updateAttributes[data.attribute] ? (
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
            ) : (
              text || "--"
            )}
          </div>
        );
      }
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "30%"
    }
  ];

  return (
    <Table
      pagination={false}
      loading={loading}
      rowKey="attribute"
      dataSource={dataSource}
      columns={columns}
    />
  );
};

export default EntryDetail;
