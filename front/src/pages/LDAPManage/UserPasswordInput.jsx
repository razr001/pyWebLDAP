import React from "react";
import { Input, Select, Row, Col } from "antd";

const { Option } = Select;

const UserPasswordInput = props => {
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
          placeholder="Please input passowrd"
        />
      </Col>
      <Col span={12}>
        <Select
          onChange={val => {
            onChange({ encrypt: val });
          }}
          allowClear
          value={value ? value.encrypt : undefined}
          style={{ width: "100%" }}
          placeholder="Please select encrypt"
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

export default UserPasswordInput;
