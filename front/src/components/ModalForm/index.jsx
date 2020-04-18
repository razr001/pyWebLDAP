import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "antd";
import FormBox from "../FormBox";

export default class ModalForm extends PureComponent {
  static propTypes = {
    formItems: PropTypes.array,
    formGroupItems: PropTypes.array,
    formLayout: PropTypes.object,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    onContinue: PropTypes.func,
    loading: PropTypes.bool,
    showContinue: PropTypes.bool,
    formRef: PropTypes.func,
    explain: PropTypes.any,
    footer: PropTypes.any
  };

  static defaultProps = {
    formItems: [], // see FormBox
    formGroupItems: [],
    formLayout: {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
      footer: null
    },

    onCancel: () => {},
    onOk: () => {},
    onContinue: () => {},
    loading: false,
    showContinue: false,
    explain: "",
    formRef: () => {}
  };

  formBox = null;

  cancelHandler = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.checkForm(onOk);
  };

  continueHandler = () => {
    const { onContinue } = this.props;
    this.checkForm(onContinue);
  };

  checkForm = callback => {
    const { form } = this.formBox.props;
    form.validateFields((error, values) => {
      if (!error) {
        callback(values);
      }
    });
  };

  afterClose = () => {
    const { form } = this.formBox.props;
    form.resetFields();
  };

  render() {
    const {
      formItems,
      formLayout,
      loading,
      onCancel,
      onOk,
      onContinue,
      showContinue,
      formRef,
      formGroupItems,
      explain,
      footer,
      ...modalProps
    } = this.props;
    return (
      <Modal
        afterClose={this.afterClose}
        onCancel={this.cancelHandler}
        footer={[
          footer,
          <Button key="cancel" onClick={this.cancelHandler}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => {
              this.okHandler();
            }}
          >
            {modalProps.okText ? modalProps.okText : "确定"}
          </Button>,
          <Button
            key="submitContinue"
            type="primary"
            loading={loading}
            onClick={() => {
              this.continueHandler();
            }}
            style={{ display: showContinue ? "inline" : "none" }}
          >
            保存并继续
          </Button>
        ]}
        {...modalProps}
      >
        {explain}
        <FormBox
          items={formItems}
          layout={formLayout}
          itemGroups={formGroupItems}
          wrappedComponentRef={form => {
            this.formBox = form;
            formRef(form);
          }}
        />
      </Modal>
    );
  }
}
