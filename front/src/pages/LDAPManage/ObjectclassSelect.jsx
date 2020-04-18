import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { getObjectclasses } from "src/services/ldap";

const { Option } = Select;

const ObjectclassSelect = props => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    getObjectclasses().then(data => {
      setDataSource(data);
    });
  }, []);

  return (
    <Select
      showSearch
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      {...props}
    >
      {dataSource.map(v => (
        <Option key={v} value={v}>
          {v}
        </Option>
      ))}
    </Select>
  );
};

export default ObjectclassSelect;
