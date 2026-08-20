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
    
    // Inicjalizacja ORYGINALNEGO efektu sieci cząsteczek
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: false },
          size: { value: 3, random: true }, // Małe, ostre kropki
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 3, // Płynny ruch sieci
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out'
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          }
        },
        retina_detect: true
      });
    }
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
      className={clsx(className, styles.root, flag && styles.hide)} 
      onClick={hideSplash} 
      onKeyDown={hideSplash} 
      role="button" 
      tabIndex={0}
    >
      <div className={styles.show}>
        <div id="particles-js" style={{ position: 'absolute', width: '100%', height: '100%' }} />
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
