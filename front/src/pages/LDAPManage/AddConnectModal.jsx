import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Checkbox, Button, Table, Space } from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  ApiOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { fetchDN } from "src/services/ldap";
import {
  addConnect,
  getConnections,
  updateConnect,
} from "src/services/connections";

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 16 }
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

const AddConnectModal = ({ visible, onCancel, onConnect }) => {
  const [form] = Form.useForm();
  const [anonymity, setAnonymity] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editData, setEditData] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const columns = [
    {
      title: "Host",
      dataIndex: "host",
      key: "host"
    },
    {
      title: "Base",
      dataIndex: "base",
      key: "base"
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text, data) => (
        <Space>
          <a
            onClick={() => {
              onEdit(data);
            }}
          >
            <FormOutlined />
          </a>
          <a>
            <DeleteOutlined />
          </a>
        </Space>
      )
    }
  ];

  useEffect(() => {
    getConnections().then(data => {
      setDataSource(data || []);
    });
  }, []);

  const onClose = () => {
    form.resetFields();
    setAnonymity(false);
    setShowForm(false);
    setEditData({});
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const onAdd = values => {
    const action = editData.id ? updateConnect : addConnect;
    setCreateLoading(true);
    action({ ...values, anonymity: values.anonymity ? 1 : 0, id: editData.id })
      .then(() => {
        setCreateLoading(false);
        onClose();
        setDataSource([]);
        // reload list
        getConnections().then(data => {
          setDataSource(data || []);
        });
      })
      .catch(() => {
        setCreateLoading(false);
      });
  };

  const onAnonymity = e => {
    setAnonymity(e.target.checked);
    if (e.target.checked) {
      form.setFieldsValue({
        username: undefined,
        password: undefined
      });
    }
  };

  const onRowSelected = (rowKeys, rows) => {
    setSelectedRowKeys(rowKeys);
    setSelectedRows(rows);
  };

  const onEdit = data => {
    setEditData(data);
    setAnonymity(data.anonymity);
    setShowForm(true);
    form.setFieldsValue(data);
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
      maskClosable={false}
      title="Connections"
      okText="Ok"
      cancelText="Cancel"
      afterClose={onClose}
      onCancel={onCancel}
      bodyStyle={{
        height: "550px",
        overflow: "auto",
        padding: showForm ? 24 : "0 0 12px 0"
      }}
      footer={
        showForm ? null : (
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                setShowForm(true);
              }}
            >
              Add connection
            </Button>
            <Button
              type="primary"
              icon={<ApiOutlined />}
              disabled={selectedRows.length === 0}
              onClick={() => {
                onConnect(selectedRows[0]);
              }}
            >
              Connection
            </Button>
          </Space>
        )
      }
    >
      {showForm && (
        <Form
          {...formItemLayout}
          form={form}
          onFinish={onAdd}
          initialValues={{ port: editData.port || 389 }}
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
            valuePropName="checked"
            rules={[{ required: false }]}
            {...tailLayout}
          >
            <Checkbox onChange={onAnonymity}>Anonymity</Checkbox>
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
          <Form.Item {...tailLayout}>
            <Space>
              <Button>Test connection</Button>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={createLoading}>
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
      {!showForm && (
        <Table
          rowSelection={{
            type: "radio",
            onChange: onRowSelected,
            selectedRowKeys
          }}
          dataSource={dataSource}
          columns={columns}
          scroll={{ y: 460 }}
          pagination={false}
          rowKey="id"
        />
      )}
    </Modal>
  );
};

export default AddConnectModal;
