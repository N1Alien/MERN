import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Jumbotron, Button, FormGroup, Label, Input } from 'reactstrap';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import Carusel from '../../features/Carusel/Carusel';
import { connect } from 'react-redux';
import { getSingleCar, currentCar } from '../../../redux/carRedux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { saveCartRequest } from '../../../redux/cartRedux';
import styles from './Product.module.scss';
import { NavLink } from 'react-router-dom';

const Component = ({ className, getCar, car, saveToCart }) => {
  const [quantity, setQuantity] = useState('1');
  const params = useParams();
  let request = '';
  useEffect(() => {
    window.scrollTo(0, 0);
    getCar(params.id);
  }, []);

  const addToCart = () => {
    saveToCart(car._id, quantity, car.mark, car.model, car.price, car.engine, request);
    toggle();
  };

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div className={clsx(className, styles.root)}>

      <div>
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle}>Product added to cart</ModalHeader>
          <ModalBody>
            You have just aded {quantity} {quantity < 2 ? `car` : `cars`} to cart. You can allways adjust number of cars in cart. In case you order more then 5 cars be aware that it may take more time to deliver.
          </ModalBody>
          <ModalFooter>
            <NavLink className={styles.link} to={`/cart`}><Button color="info" >Go to cart</Button>{' '}</NavLink>
            <Button color="info" onClick={toggle}>Continue</Button>
          </ModalFooter>
        </Modal>
      </div>

      {car && <Jumbotron className={styles.jumbo}>
        <h1 className="display-4">{car.mark}</h1>
        <h1 className="display-4">{car.model}</h1>
        <Carusel />
        <p className="lead">This is uniqe mashine cost only {car.price}$, it is run by {car.engine} engine. We can assemble for you model form {car.year} calling extra attention to details.</p>
        <hr className="my-2" />
        <p>Cars are our passion. We do everything to make customers happy. In case of any questions please contact us.</p>
        <p className="lead">
          <Button onClick={addToCart} color="success">Add To Cart</Button>
        </p>
        <FormGroup className={styles.choseNumber}>
          <Label for="exampleSelect">How many you want ?</Label>
          <Input onChange={event => setQuantity(event.target.value)} className={styles.input} type="select" name="select" id="exampleSelect">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Input>
        </FormGroup>
      </Jumbotron>}
    </div>
  );
};

Component.propTypes = {
  car: PropTypes.object,
  className: PropTypes.string,
  getCar: PropTypes.func,
  saveToCart: PropTypes.func,
};

const mapStateToProps = state => ({
  car: currentCar(state),
});

const mapDispatchToProps = dispatch => ({
  getCar: (id) => dispatch(getSingleCar(id)),
  saveToCart: (id, amount, mark, model, price, engine, request) => dispatch(saveCartRequest({ id, amount, mark, model, price, engine, request })),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(Component);

export {
  Container as Product,
  Component as ProductComponent,
};
