import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

const ErrorDisplay = ({ msg }) => {

  return (
    <div>
      <Alert color="danger">
        {msg}
      </Alert>
    </div>
  );
};

ErrorDisplay.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  msg: PropTypes.string,
};

export default ErrorDisplay;
