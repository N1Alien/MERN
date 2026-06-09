import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { saveCartRequest } from '../../../redux/cartRedux';
import styles from './AmountWidget.module.scss';

const AmountWidget = ({ className, amount, saveToCart, id }) => {
  const [number, setNumber] = useState([amount]);

  const plus = (id) => {
    if (number < 100) {
      setNumber(parseInt(number) + 1);
    }
    saveToCart(id, 1);
  };

  const minus = (id) => {
    if (number > 1) {
      setNumber(parseInt(number - 1));
    }
    saveToCart(id, 1, 'decrease');
  };

  return (
    <div value={number} className={clsx(className, styles.root)}>
      <p onClick={() => minus(id)} className={styles.arrow}>-</p>{number}<p onClick={() => plus(id)} className={styles.arrow}>+</p>
    </div>
  );
};

AmountWidget.propTypes = {
  amount: PropTypes.any,
  className: PropTypes.string,
  saveToCart: PropTypes.func,
  id: PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  saveToCart: (id, amount, minus) => dispatch(saveCartRequest({ id, amount, minus })),
});

export default connect(null, mapDispatchToProps)(AmountWidget);

