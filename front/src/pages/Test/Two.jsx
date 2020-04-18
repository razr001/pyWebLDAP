import React, { Component } from "react";
import Modal from "./Modal";

export default class Two extends Component {
  render() {
    return (
      <div>
        <Modal text="Two" syncKey="Two" />
      </div>
    );
  }
}
