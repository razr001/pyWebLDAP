import React from "react";
import { Row, Form, Input, Button, message } from "antd";
import { changePassword } from "src/services/ldap";
import styles from "./index.less";

const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};

const tailLayout = {
  wrapperCol: { offset: 10, span: 14 }
};

const ChangeUserPassword = () => {
  // const [selectDN, setSelectDN] = useState();

  const onFinish = values => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Confirm your password");
      return;
    }
    changePassword(values).then(() => {
      message.success("Password changed");
      form.resetFields();
    });
  };

  const [form] = Form.useForm();

  return (
    <Row className={styles.box}>
      <Form {...formItemLayout} form={form} onFinish={onFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
};

export default ChangeUserPassword;
