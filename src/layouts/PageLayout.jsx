import PropTypes from "prop-types";
import { ScrollRestoration } from "react-router-dom";

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function MainLayout({ children }) {
  return (
    <>
      <ScrollRestoration />
      {children}
    </>
  );
}
