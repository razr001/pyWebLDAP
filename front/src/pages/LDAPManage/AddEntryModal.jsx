import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { getObjectclassesAttr, addEntry } from "src/services/ldap";
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

const AddEntryModal = ({ visible, onOk, onCancel, targetDN }) => {
  const [objectclassAttr, setObjectclassAttr] = useState({});
  const [dnData, setDnData] = useState({});

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      targetDN
    });
  }, [targetDN]);

  const onObjectclassChange = value => {
    Object.keys(dnData).forEach(key => {
      form.setFieldsValue({
        [key]: undefined
      });
    });
    form.setFieldsValue({
      dn: undefined
    });
    setDnData({});
    getObjectclassesAttr(value).then(data => {
      setObjectclassAttr(data);
    });
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
    // form.resetFields()
    Object.keys(dnData).forEach(key => {
      form.setFieldsValue({
        [key]: undefined
      });
    });
    setDnData({});
    setObjectclassAttr({});
    form.setFieldsValue({
      objectClass: undefined,
      dn: undefined,
      targetDN: undefined
    });
  };

  const onOkHandler = values => {
    addEntry(values).then(() => {
      onOk();
    });
  };

  return (
    <Modal
      visible={visible}
      width={650}
      title="New entry "
      okText="Ok"
      cancelText="Cancel"
      afterClose={onClose}
      onCancel={onCancel}
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
      <Form
        {...formItemLayout}
        form={form}
        // layout="vertical"
        // name="form_in_modal"
        // initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          key="targetDN"
          name="targetDN"
          label="Target dn"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          key="objectClass"
          name="objectClass"
          label="ObjectClass"
          rules={[{ required: true, message: "ObjectClass is require" }]}
        >
          <ObjectclassSelect onChange={onObjectclassChange} />
        </Form.Item>
        {objectclassAttr.must &&
          objectclassAttr.must.map(v => (
            <Form.Item
              key={v.name}
              name={v.name}
              label={v.name}
              rules={[{ required: true, message: `${v} is require` }]}
            >
              <Input
                onBlur={e => {
                  onInput(v.name, e.target.value);
                }}
              />
            </Form.Item>
          ))}
        <Form.Item
          name="dn"
          label="Rdn"
          rules={[{ required: true, message: "dn is require" }]}
        >
          <Select>
            {Object.keys(dnData).map(key => (
              <Option key={key} value={`${key}=${dnData[key]}`}>
                {`${key}=${dnData[key]}`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {objectclassAttr.may &&
          objectclassAttr.may.map(v => (
            <Form.Item key={v.name} name={v.name} label={v.name}>
              <Input
                onBlur={e => {
                  onInput(v.name, e.target.value);
                }}
              />
            </Form.Item>
          ))}
      </Form>
    </Modal>
  );
};

export default AddEntryModal;
