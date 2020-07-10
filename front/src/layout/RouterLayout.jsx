import { checkLogin } from "src/services/auth";

export default function RouterLayout(props) {
  const {
    children,
    history: { location }
  } = props;
  if (location.pathname !== "/login") {
    checkLogin();
  }
  return children;
}
