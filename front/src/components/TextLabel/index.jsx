import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "antd";
import styles from "./index.less";

class TextLbel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOver: false
    };
    this.labelRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      isOver:
        this.labelRef.current.clientWidth < this.labelRef.current.scrollWidth
    });
  }

  render() {
    const { style, text, className } = this.props;
    const { isOver } = this.state;
    let showText = text;
    if (
      !text ||
      text.toLowerCase() === "null" ||
      text.toLowerCase() === "undefined"
    ) {
      showText = "";
    }
    const element = (
      <div
        className={`${styles.textLabel} ${className}`}
        style={style}
        ref={this.labelRef}
      >
        {showText}
      </div>
    );

    return isOver ? (
      <Tooltip title={text} arrowPointAtCenter>
        {element}
      </Tooltip>
    ) : (
      element
    );
  }
}

TextLbel.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  text: PropTypes.string
};
TextLbel.defaultProps = {
  className: "",
  style: {},
  text: ""
};

export default TextLbel;
