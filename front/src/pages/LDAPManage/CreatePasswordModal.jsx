import React, { useState } from "react";
import { Modal } from "antd";
import UserPasswordInput from "./UserPasswordInput";

const CreatePasswordModal = props => {
  const [userPassword, setUserPassword] = useState({});

  const onPassword = value => {
    setUserPassword(value);
  };

  const onOk = () => {
    if (props.onOk) {
      props.onOk(userPassword);
    }
  };

  return (
    <Modal
      title="New password"
      {...props}
      onOk={onOk}
      afterClose={() => {
        setUserPassword({});
      }}
    >
      <UserPasswordInput onChange={onPassword} value={userPassword} />
    </Modal>
  );
};

export default CreatePasswordModal;
