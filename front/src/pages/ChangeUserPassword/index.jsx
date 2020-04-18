import React from "react";
import { Row, Form, Input, Button, message } from "antd";
import { changePassword } from "src/services/ldap";
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

const ChangeUserPassword = () => {
  // const [selectDN, setSelectDN] = useState();

  const onFinish = values => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Confirm your password");
      return;
    }
    changePassword(values).then(rel => {
      console.log(rel);
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
          label="用户名"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="旧密码"
          name="oldPassword"
          rules={[
            { required: true, message: "Please input your old password!" }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="newPassword"
          rules={[
            { required: true, message: "Please input your new password!" }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[
            { required: true, message: "Please input your confirm password!" }
          ]}
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
