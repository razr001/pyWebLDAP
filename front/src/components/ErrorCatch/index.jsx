import React from "react";

export default ComponentClass => {
  return class ErrorCatch extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, info: null };
    }

    componentDidCatch(error, info) {
      this.setState({ error, info });
      // 上传错误到到服务器
      // logErrorToMyService(error, info);
    }

    render() {
      const { error, info } = this.state;
      if (error) {
        return (
          <div>
            发生错误: {error.toString()}
            <br />
            {info.componentStack}
          </div>
        );
      }
      return <ComponentClass {...this.props} />;
    }
  };
};
