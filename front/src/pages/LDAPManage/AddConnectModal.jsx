import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Checkbox } from "antd";
import { addConnect } from "src/services/ldap";
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

const AddConnectModal = ({ visible, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const onClose = () => {
    form.resetFields();
  };

  const okHandler = values => {
    addConnect(values).then(() => {
      onOk();
    });
  };

  const onAnonymity = value => {
    console.log("----------------------", value);
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
        form
          .validateFields()
          .then(values => {
            okHandler(values);
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
          <Input />
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
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          key="password"
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddConnectModal;
