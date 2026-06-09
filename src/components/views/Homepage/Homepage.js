import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { readCars, loadCars, getViewMode } from '../../../redux/carRedux';
import { useHistory } from 'react-router-dom';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, Button,
} from 'reactstrap';
import clsx from 'clsx';
import styles from './Homepage.module.scss';
import SearchBar from '../../features/SearchBar/SearchBar';

const Component = ({ className, getCars, cars, getMode }) => {

  const history = useHistory();

  useEffect(() => {
    getCars();
  }, []);

  let carsArray = [];
  if (cars) {
    for (let i = 0; i < cars.length; i++) {
      carsArray.push(cars[i]);
    }
  }

  const routeChange = (id) => {
    let path = `/product/${id}`;
    history.push(path);
  };

  const mode = getMode;

  return (
    <>
      <SearchBar />
      <div className={clsx(className, styles.root)}>
        {(cars) && carsArray.map((car) => <Card key={car._id} className={mode === 'desktop' ? styles.carDesktop : mode === 'mobile' ? styles.carMobile : styles.carTablet} >
          <CardImg className={styles.carImg} src={car.img[0]} alt="Card image cap" />
          <CardBody className={styles.carBody}>
            <CardTitle>{car.mark}</CardTitle>
            <Button color="success" outline className={styles.btn} onClick={() => routeChange(car._id)} >Details</Button>
            <CardText>Only: {car.price}$</CardText>
          </CardBody>
        </Card>)}
      </div>
    </>
  );
};

Component.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  getCars: PropTypes.func,
  cars: PropTypes.any,
  getMode: PropTypes.string,
};

const mapStateToProps = (state) => ({
  cars: readCars(state),
  getMode: getViewMode(state),
});

const mapDispatchToProps = dispatch => ({
  getCars: () => dispatch(loadCars()),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(Component);
export {

  Container as Homepage,
  Component as HomepageComponent,
};
