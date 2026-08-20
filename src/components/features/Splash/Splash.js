import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Splash.module.scss';
import { connect } from 'react-redux';
import { loadCars } from '../../../redux/carRedux';

const Component = ({ className, getCars }) => {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    getCars();
  }, [getCars]);

  const scroolChange = () => {
    window.scrollTo(0, 0);
  };

  const hideSplash = () => {
    scroolChange();
    setFlag(true);
  };

  return (
    <div 
      className={clsx(className, styles.root)} 
      onClick={hideSplash} 
      onKeyDown={hideSplash} 
      role="button" 
      tabIndex={0}
    >
      <div className={flag ? styles.hide : styles.show}>
        {/* Nowoczesne, czyste tło CSS zastępujące wadliwy skrypt particles.js */}
        <div className={styles.starsContainer}>
          <div className={styles.stars}></div>
          <div className={styles.stars2}></div>
          <div className={styles.stars3}></div>
        </div>
        
        <div className={styles.header}>
          3D-Printed Cars
        </div>
      </div>
    </div>
  );
};

Component.propTypes = {
  className: PropTypes.string,
  getCars: PropTypes.func,
 };

const mapDispatchToProps = dispatch => ({
  getCars: () => dispatch(loadCars()),
});

const Container = connect(null, mapDispatchToProps)(Component);

export {
  Container as Splash,
  Component as SplashComponent,
};
