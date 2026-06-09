import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './NotFound.module.scss';

const Component = ({ className }) => (
  <div className={clsx(className, styles.root)}>
    <h1>404</h1>
    <h2>page not found</h2>
    <h3>:(</h3>
  </div>
);

Component.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export {
  Component as NotFound,
  Component as NotFoundComponent,
};
