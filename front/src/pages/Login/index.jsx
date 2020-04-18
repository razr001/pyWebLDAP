import React from "react";
import { Row, Form, Input, Button, message } from "antd";
import { login } from "src/services/auth";
import styles from "./index.less";

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const AdminLogin = props => {
  const onFinish = values => {
    login(values).then(() => {
      props.history.push("/ldap");
    });
  };

  const [form] = Form.useForm();

  return (
    <Row className={styles.box}>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        // layout="vertical"
        // name="form_in_modal"
        // initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          label="Admin"
          name="username"
          rules={[{ required: true, message: "Please input your admin ame!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
};

export default AdminLogin;
