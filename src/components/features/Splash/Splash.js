import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Splash.module.scss';
import Particles from 'react-particles-js';
import { connect } from 'react-redux';
import { loadCars } from '../../../redux/carRedux';

const Component = ({ className, getCars }) => {

  const [flag, setFlag] = useState(false);

  useEffect(() => {
    getCars();
  }, []);

  const hideSplash = () => {
    scroolChange();
    setFlag(true);
  };

  const scroolChange = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className={clsx(className, styles.root)} onClick={hideSplash} >

      <div className={flag ? styles.hide : styles.show}>
        <Particles
          canvasClassName={styles.part}
          params={{
            'particles': {
              'number': {
                'value': 120,
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
                'stroke': {
                  'width': 0,
                  'color': '#000000',
                },
                'polygon': {
                  'nb_sides': 5,
                },
              },
              'opacity': {
                'value': 0.5,
                'random': false,
                'anim': {
                  'enable': false,
                  'speed': 1,
                  'opacity_min': 0.1,
                  'sync': false,
                },
              },
              'size': {
                'value': 1,
                'random': true,
                'anim': {
                  'enable': false,
                  'speed': 40,
                  'size_min': 0.1,
                  'sync': false,
                },
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
                'speed': 6,
                'direction': 'none',
                'random': false,
                'straight': false,
                'out_mode': 'out',
                'attract': {
                  'enable': false,
                  'rotateX': 600,
                  'rotateY': 1200,
                },
              },
            },
            'interactivity': {
              'detect_on': 'canvas',
              'events': {
                'onhover': {
                  'enable': true,
                  'mode': 'repulse',
                },
                'onclick': {
                  'enable': true,
                  'mode': 'push',
                },
                'resize': true,
              },
              'modes': {
                'grab': {
                  'distance': 100,
                  'line_linked': {
                    'opacity': 1,
                  },
                },
                'bubble': {
                  'distance': 400,
                  'size': 40,
                  'duration': 2,
                  'opacity': 8,
                  'speed': 3,
                },
                'repulse': {
                  'distance': 100,
                },
                'push': {
                  'particles_nb': 4,
                },
                'remove': {
                  'particles_nb': 2,
                },
              },
            },
            'retina_detect': true,
            'config_demo': {
              'hide_card': false,
              'background_color': '#b61924',

              'background_position': '50% 50%',
              'background_repeat': 'no-repeat',
              'background_size': 'cover',
            },
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
  children: PropTypes.node,
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