import React from "react";
import { Select } from "antd";

const { Option } = Select;

const ObjectclassSelect = ({ dataSource, ...props }) => {
  // const [dataSource, setDataSource] = useState([]);
  // useEffect(() => {
  //   getObjectclasses().then(data => {
  //     setDataSource(data);
  //   });
  // }, []);

  return (
    <Select
      showSearch
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      {...props}
    >
      {dataSource &&
        dataSource.map(v => (
          <Option key={v} value={v}>
            {v}
          </Option>
        ))}
    </Select>
  );
};

export default ObjectclassSelect;
