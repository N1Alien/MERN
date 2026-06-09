import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, FormGroup, Label, Input, Button } from 'reactstrap';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { readCars, loadFiltredCars, loadCars } from '../../../redux/carRedux';
import styles from './SearchBar.module.scss';

const SearchBar = ({ className, cars, filterCars, getCars }) => {

  const [phrase, setPhrase] = useState('');
  const [flag, setFlag] = useState(true);

  const checker = () => {
    if (phrase) {
      setFlag(false);
      const filtredCarsArray = Array.from(cars);
      const filtred = filtredCarsArray.filter(car => { return (car.mark.toLowerCase()).includes(phrase.toLowerCase()); });
      filterCars(filtred);
    } else {
      getCars();
    }
  };

  const clear = () => {
    setFlag(true);
    getCars();
    setPhrase('');
  };

  return (
    <div className={clsx(className, styles.root)}>
      <Col className={styles.input} sm={6}>
        <FormGroup>
          <Label for="search"></Label>
          {flag ? <Button color="success" className={styles.enter} onClick={checker}>Search</Button> :
            <Button outline color="danger" className={styles.enter} onClick={clear}>Reset</Button>}
          <Label for="serch" />
          <Input className={styles.input} value={phrase} type="text" name="search" id="search" placeholder="type car mark" autoComplete="off" onChange={(e) => setPhrase(e.target.value)} />
        </FormGroup>
      </Col>
    </div>
  );
};

SearchBar.propTypes = {
  cars: PropTypes.any,
  className: PropTypes.string,
  getCars: PropTypes.func,
  filterCars: PropTypes.func,
};

const mapStateToProps = state => ({
  cars: readCars(state),
});

const mapDispatchToProps = dispatch => ({
  filterCars: data => dispatch(loadFiltredCars(data)),
  getCars: () => dispatch(loadCars()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
