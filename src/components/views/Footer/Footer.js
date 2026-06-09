import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import 'font-awesome/css/font-awesome.min.css';
import styles from './Footer.module.scss';

const Component = ({ className }) => {

  return (
    <div className={clsx(className, styles.root)}>
      <div className={styles.social}>
        <a href="https://www.facebook.com" target="blank" aria-label="facebook"><i className="fa fa-facebook"></i></a>
        <a href="https://www.youtube.com" target="blank" aria-label="youtube"><i className="fa fa-youtube"></i></a>
        <a href="https://www.instagram.com" target="blank" aria-label="instagram"><i className="fa fa-instagram"></i></a>
      </div>
    </div>
  );
};

Component.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export {
  Component as Footer,
  Component as FooterComponent,
};
