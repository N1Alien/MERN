import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import NavBar from '../../features/Navbar/Navbar';
import NavBarMobile from '../../features/NavBarMobile/NavBarMobile';
import { connect } from 'react-redux';
import { setGlobalViewPort } from '../../../redux/carRedux';
import { loadCartRequest } from '../../../redux/cartRedux';
import styles from './Header.module.scss';
const Component = ({ className, setViewPort, showCart }) => {

  let mode = null;
  const [size, setSize] = useState([0]);

  if (size < 400) {
    mode = 'mobile';
  } else if (size < 700) { mode = 'tablet'; }
  else {
    mode = 'desktop';
  }

  useLayoutEffect(() => {

    showCart();
    function updateSize() {
      setSize([window.innerWidth]);

    }
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);

  }, []);

  setViewPort(mode);
  return (
    <div className={clsx(className, styles.root)}>
      {mode === 'desktop' || mode === 'tablet' ? <NavBar /> : <NavBarMobile mode={'mobile'} />}
    </div >
  );
};

Component.propTypes = {
  setViewPort: PropTypes.func,
  className: PropTypes.string,
  cart: PropTypes.object,
  showCart: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  setViewPort: (mode) => dispatch(setGlobalViewPort(mode)),
  showCart: () => dispatch(loadCartRequest()),
});

const Container = connect(null, mapDispatchToProps)(Component);

export {
  Container as Header,
  Component as HeaderComponent,
};
