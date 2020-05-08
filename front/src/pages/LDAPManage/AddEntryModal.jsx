import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import {
  getObjectclassesAttr,
  addEntry,
  getObjectclasses,
  getEntryDetail,
  // updateEntry,
} from "src/services/ldap";
import ObjectclassSelect from "./ObjectclassSelect";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};

const UserPassword = props => {
  const { value } = props;
  const onChange = val => {
    if (props.onChange) {
      props.onChange({
        ...value,
        ...val
      });
    }
  };
  return (
    <Row gutter={6}>
      <Col span={12}>
        <Input
          onChange={e => {
            onChange({ password: e.target.value });
          }}
          value={value ? value.password : undefined}
        />
      </Col>
      <Col span={12}>
        <Select
          onChange={val => {
            onChange({ encrypt: val });
          }}
          allowClear
          value={value ? value.encrypt : undefined}
        >
          <Option value="SSHA">SSHA</Option>
          <Option value="SMD5">SMD5</Option>
          <Option value="SHA">SHA</Option>
          <Option value="MD5">MD5</Option>
        </Select>
      </Col>
    </Row>
  );
};

const AddEntryModal = ({ visible, onOk, onCancel, targetDN, editEnable }) => {
  // objectclass attr
  const [objectclassAttr, setObjectclassAttr] = useState({}); // {'objectclass name': {objectclass info...}}
  const [dnData, setDnData] = useState({});
  // all ldap server objectclass
  const [allObjectclass, setAllObjectclass] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    getObjectclasses().then(data => {
      setAllObjectclass(data);
    });
  }, []);

  useEffect(() => {
    if (!editEnable) {
      form.setFieldsValue({
        targetDN
      });
    }
  }, [targetDN, visible]);

  useEffect(() => {
    if (editEnable) {
      getEntryDetail(targetDN).then(data => {
        if (!data) return;

        form.setFieldsValue({
          objectClass: data.attributes.objectClass,
          dn: targetDN
        });

        // 获取objectclass的属性
        getObjectclassesAttr(data.attributes.objectClass.join()).then(
          attrData => {
            if (attrData) {
              Object.keys(attrData).forEach(key => {
                objectclassAttr[key] = attrData[key];
              });
            }
            setObjectclassAttr({ ...objectclassAttr });
          }
        );

        //  设置表单值
        Object.keys(data.attributes).forEach(key => {
          form.setFieldsValue({
            [key]: data.attributes[key].join()
          });
        });
      });
    }
  }, [editEnable]);

  const onObjectclassChange = values => {
    // 当前已选的objectclass
    const currObjectclasses = Object.keys(objectclassAttr);
    // 新增的objectclass
    const newObjectclasses = values.filter(
      v => currObjectclasses.indexOf(v) === -1
    );
    // 移除删除的objectclass
    currObjectclasses.forEach(name => {
      if (values.indexOf(name) === -1) {
        objectclassAttr[name].attribute.forEach(attr => {
          // 删除Rdn 下拉数据
          form.setFieldsValue({
            [attr.name]: undefined
          });
          delete dnData[attr.name];
        });
        delete objectclassAttr[name];
        // 更新删除
        setObjectclassAttr({ ...objectclassAttr });
        setDnData({ ...dnData });
      }
    });

    // 获取新增的objectclass的属性
    if (newObjectclasses && newObjectclasses.length > 0) {
      getObjectclassesAttr(newObjectclasses.join()).then(data => {
        if (data) {
          Object.keys(data).forEach(key => {
            objectclassAttr[key] = data[key];
          });
        }
        setObjectclassAttr({ ...objectclassAttr });
      });
    }
  };

  const onInput = (attr, value) => {
    if (value) {
      setDnData({
        ...dnData,
        [attr]: value
      });
    } else {
      delete dnData[attr];
      setDnData({
        ...dnData
      });
    }
  };

  const onClose = () => {
    form.resetFields();
    setDnData({});
    setObjectclassAttr({});
  };

  const onOkHandler = values => {
    // if(editEnable){

    // }
    addEntry(values).then(() => {
      onOk();
    });
  };

  const exist = [];
  const items = [];
  Object.keys(objectclassAttr).forEach(key => {
    const objectclass = objectclassAttr[key];
    objectclass.attribute.forEach(attr => {
      if (exist.indexOf(attr.name) === -1) {
        exist.push(attr.name);
        items.push(
          <Form.Item
            key={attr.name}
            name={attr.name}
            label={attr.name}
            rules={[
              { required: attr.required, message: `${attr.name} is require` }
            ]}
          >
            {attr.name === "userPassword" || attr.name === "unicodePwd" ? (
              <UserPassword />
            ) : (
              <Input
                onBlur={e => {
                  if (attr.required) {
                    onInput(attr.name, e.target.value);
                  }
                }}
              />
            )}
          </Form.Item>
        );
      }
    });
  });

  return (
    <Modal
      visible={visible}
      width={650}
      title="New entry "
      okText="Ok"
      cancelText="Cancel"
      afterClose={onClose}
      onCancel={onCancel}
      getContainer={false}
      maskClosable={false}
      bodyStyle={{
        height: "550px",
        overflow: "auto"
      }}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            onOkHandler(values);
          })
          .catch(info => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form {...formItemLayout} form={form}>
        {!editEnable && (
          <Form.Item
            key="targetDN"
            name="targetDN"
            label="Target dn"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item
          key="objectClass"
          name="objectClass"
          label="ObjectClass"
          rules={[{ required: true, message: "ObjectClass is require" }]}
        >
          <ObjectclassSelect
            mode="multiple"
            dataSource={allObjectclass}
            onChange={onObjectclassChange}
          />
        </Form.Item>
        <Form.Item
          name="dn"
          label="Rdn"
          rules={[{ required: true, message: "dn is require" }]}
        >
          {editEnable ? (
            <Input disabled />
          ) : (
            <Select>
              {Object.keys(dnData).map(key => (
                <Option key={key} value={`${key}=${dnData[key]}`}>
                  {`${key}=${dnData[key]}`}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {items}
      </Form>
    </Modal>
  );
};

export default AddEntryModal;
