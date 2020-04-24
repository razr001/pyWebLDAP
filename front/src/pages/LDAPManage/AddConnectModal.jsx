import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { addConnect, fetchDN } from "src/services/ldap";

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};

const BaseInput = ({ onClick, ...props }) => {
  return (
    <>
      <Input style={{ width: "330px" }} {...props} />
      <Button style={{ marginLeft: "6px" }} onClick={onClick}>
        fetch
      </Button>
    </>
  );
};

const AddConnectModal = ({ visible, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const [anonymity, setAnonymity] = useState(false);

  const onClose = () => {
    form.resetFields();
    setAnonymity(false);
  };

  const okHandler = values => {
    addConnect(values).then(() => {
      onOk();
    });
  };

  const onAnonymity = e => {
    setAnonymity(e.target.checked);
  };

  const getBaseDN = () => {
    const host = form.getFieldValue("host");
    const port = form.getFieldValue("port");
    fetchDN({ host, port }).then(rel => {
      form.setFieldsValue({
        base: rel
      });
    });
  };

  return (
    <Modal
      visible={visible}
      width={650}
      title="New connect"
      okText="Ok"
      cancelText="Cancel"
      afterClose={onClose}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then(values => {
          okHandler(values);
        });
      }}
    >
      <Form
        {...formItemLayout}
        form={form}
        // layout="vertical"
        // name="form_in_modal"
        initialValues={{ port: 389 }}
      >
        <Form.Item
          key="host"
          name="host"
          label="Host"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          key="port"
          name="port"
          label="Port"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          key="base"
          name="base"
          label="Base"
          rules={[{ required: true }]}
        >
          <BaseInput onClick={getBaseDN} />
        </Form.Item>
        <Form.Item
          key="anonymity"
          name="anonymity"
          label="Anonymity"
          rules={[{ required: false }]}
        >
          <Checkbox onChange={onAnonymity} />
        </Form.Item>
        <Form.Item
          key="username"
          name="username"
          label="Username"
          rules={[{ required: !anonymity }]}
        >
          <Input disabled={anonymity} />
        </Form.Item>
        <Form.Item
          key="password"
          name="password"
          label="Password"
          rules={[{ required: !anonymity }]}
        >
          <Input disabled={anonymity} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddConnectModal;
