import React from "react";
import PropTypes from "prop-types";
import animejs from "animejs";

export default class Anime extends React.PureComponent {
  static propTypes = {
    opt: PropTypes.object
  };

  static defaultProps = {
    opt: {}
  };

  constructor(props) {
    super(props);
    this.anime = null;
  }

  componentDidMount() {
    const { opt } = this.props;
    this.anime = animejs(opt);
  }

  componentWillUnmount() {
    const { opt } = this.props;
    this.anime.remove(opt.target);
  }

  render() {
    const { children } = this.props;
    return children;
  }
}
