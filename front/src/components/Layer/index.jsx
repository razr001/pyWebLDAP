import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import styles from "./index.less";

export default class Layer extends PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    zIndex: PropTypes.number,
    selected: PropTypes.bool
  };

  static defaultProps = {
    width: 300,
    height: 200,
    x: 0,
    y: 0,
    zIndex: 1,
    selected: false
  };

  constructor(props) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height
    });
  }

  render() {
    const { children, selected, zIndex } = this.props;
    const { width, height, x, y } = this.state;
    return (
      <Rnd
        className={selected ? styles.selected : ""}
        style={{ zIndex }}
        size={{ width, height }}
        position={{ x, y }}
        onDragStop={(e, d) => {
          this.setState({ x: d.x, y: d.y });
        }}
        onResize={(e, direction, ref, delta, position) => {
          this.setState({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position
          });
        }}
      >
        {children}
      </Rnd>
    );
  }
}
