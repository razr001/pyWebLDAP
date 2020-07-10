import React from "react";

export default class PageLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return children;
  }
}
