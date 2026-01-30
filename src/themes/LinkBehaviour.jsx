import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

const LinkBehaviour = forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return (
    <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />
  );
});

LinkBehaviour.displayName = "LinkBehaviour";

LinkBehaviour.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
  scroll: PropTypes.bool,
};

export default LinkBehaviour;
