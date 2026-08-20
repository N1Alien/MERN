import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Splash.module.scss';
import 'particles.js';
import { connect } from 'react-redux';
import { loadCars } from '../../../redux/carRedux';

const Component = ({ className, getCars }) => {

  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        /* Global configuration fallback */
      });
    }
  }, []);

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
    <div className={clsx(className, styles.root)} onClick={hideSplash} onKeyDown={hideSplash} role="button" tabIndex={0}>
      <div className={flag ? styles.hide : styles.show}>
        <div 
          id="particles-js" 
          style={{ position: 'absolute', width: '100%', height: '100%' }} 
          canvasClassName={styles.part}
          params={{
            'particles': {
              'number': {
                'value': 80,
                'density': {
                  'enable': true,
                  'value_area': 800,
                },
              },
              'color': {
                'value': '#ffffff',
              },
              'shape': {
                'type': 'circle',
              },
              'opacity': {
                'value': 0.5,
                'random': false,
              },
              'size': {
                'value': 3,
                'random': true,
              },
              'line_linked': {
                'enable': true,
                'distance': 150,
                'color': '#ffffff',
                'opacity': 0.4,
                'width': 1,
              },
              'move': {
                'enable': true,
                'speed': 2,
                'direction': 'none',
                'random': false,
                'straight': false,
                'out_mode': 'out',
              },
            },
            'interactivity': {
              'detect_on': 'canvas',
              'events': {
                'onhover': {
                  'enable': true,
                  'mode': 'grab',
                },
                'onclick': {
                  'enable': true,
                  'mode': 'push',
                },
                'resize': true,
              },
            },
            'retina_detect': true,
          }}
        />
        <div className={styles.header}>
          3D-Printed Cars
        </div>
      </div>
    </div >
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
