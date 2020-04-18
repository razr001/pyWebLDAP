import React from "react";
import { Button, Modal } from "antd";
import StateSyncComponent from "src/components/StateSyncComponent";

export default class ModalTest extends StateSyncComponent {
  state = { visible: false };

  constructor(props, context) {
    super(props, context);
    this.bindSync("visible");
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    const { visible } = this.state;
    const { text } = this.props;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          {text}
        </Button>
        <Modal
          title="Basic Modal"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>{text}</p>
        </Modal>
      </div>
    );
  }
}
