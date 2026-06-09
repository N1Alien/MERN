import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import clsx from 'clsx';
import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import isPostalCode from 'validator/lib/isPostalCode';
import { connect } from 'react-redux';
import { getCart, newOrder, removeCart, loadCartRequest } from '../../../redux/cartRedux';
import ErrorDisplay from '../../features/ErrorDisplay/ErrorDisplay';
import styles from './Order.module.scss';
import { Redirect } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Jumbotron, Table } from 'reactstrap';

const Component = ({ className, cart, sendOrderRequest, clearLocalStorage }) => {

  let cartArray = [];
  useEffect(() => {
    window.scrollTo(0, 0);
    cartArray = [];
  }, [cart.products]);

  const [modal, setModal] = useState(false);
  const [data, setData] = useState('');
  const toggle = () => setModal(!modal);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    check: '',
    errorMsg: false,
  });

  const redirect = () => {
    sendOrderRequest(data);
    setFormData({
      name: '',
      email: '',
      address: '',
      city: '',
      zip: '',
      check: '',
    });
    clearLocalStorage();
  };

  const sendOrderToDB = () => {

    const data = {
      products: cartArray,
      client: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
      },
    };
    setData(data);
    toggle();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {

    const { name, email, address, city, zip, check } = formData;
    e.preventDefault();
    if (isEmpty(name) || isEmpty(email) || isEmpty(address) || isEmpty(city) || isEmpty(zip) || isEmpty(check)) {
      setFormData({
        ...formData, errorMsg: 'All fields requaierd',
      });
    } else if (!isEmail(email)) {
      setFormData({
        ...formData, errorMsg: 'Invalide email',
      });
    } else if (!isPostalCode(zip, 'any')) {
      setFormData({
        ...formData, errorMsg: 'Invalide postcode',
      });
    } else if ((name.lenght < 3) || (address.lenght < 5) || (city.lenght < 3) || (zip < 5)) {
      setFormData({
        ...formData, errorMsg: 'Inputs need to have correct lenght',
      });
    } else {
      setFormData({
        ...formData, errorMsg: false,
      });
      sendOrderToDB();
    }
  };

  cartArray = Array.from(cart.products);

  return (
    <>
      <div>
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle}>Your order has been submited</ModalHeader>
          <ModalBody>
            We are very happy that you like our product. It will be delivered to you by drons in 7 days.
            Thank You for chosing our company
          </ModalBody>
          <ModalFooter>
            <Button color="info" onClick={redirect}>Continue</Button>
          </ModalFooter>
        </Modal>
      </div>
      {(!cartArray[0]) ? <Redirect to='/' /> : <div className={clsx(className, styles.root)}>
        <Jumbotron className={styles.card}>
          <Table responsive>
            <thead >
              <tr>
                <th>quantity</th>
                <th>mark</th>
                <th>model</th>
                <th>total</th>
              </tr>
            </thead>
            {cartArray.map(item => <tbody key={item.id}>
              <tr>
                <td>{item.amount}</td>
                <td>{item.mark}</td>
                <td>{item.model}</td>
                <td>{item.price * item.amount}$</td>
              </tr>
              <tr >
                <td className={styles.request} colSpan='300px' >{item.request && item.request}</td>
              </tr>
            </tbody>)}
          </Table>
        </Jumbotron >
        <Jumbotron className={styles.jumbo}>
          <Form
            onSubmit={handleSubmit}
          >
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="examplePassword">Name</Label>
                  <Input className={styles.input} minLength="2" maxLength="12" type="text" name="name" id="name" placeholder="Your name" onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="exampleEmail">Email</Label>
                  <Input className={styles.input} type="email" pattern="^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$" name="email" id="exampleEmail" placeholder="your email" onChange={handleChange} />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="exampleAddress">Address</Label>
              <Input className={styles.input} minLength="6" maxLength="22" type="text" name="address" id="exampleAddress" placeholder="delivery aderss" onChange={handleChange} />
            </FormGroup>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="exampleCity">City</Label>
                  <Input className={styles.input} minLength="3" maxLength="16" type="text" name="city" id="exampleCity" placeholder="your city" onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="exampleZip">Post-Code</Label>
                  <Input className={styles.input} type="text" name="zip" id="exampleZip" placeholder="post-code" onChange={handleChange} />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup className={styles.check} check>
              <Input type="checkbox" name="check" id="exampleCheck" onChange={handleChange} />
              <Label for="exampleCheck" check>Check me out</Label>
            </FormGroup>
            {formData.errorMsg && <ErrorDisplay msg={formData.errorMsg} />}
            <Button outline color="success">Buy it!</Button>
          </Form>
        </Jumbotron>
      </div>}
    </>
  );
};

Component.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  cart: PropTypes.object,
  sendOrderRequest: PropTypes.func,
  clearLocalStorage: PropTypes.func,
};

const mapStateToProps = state => ({
  cart: getCart(state),
});

const mapDispatchToProps = dispatch => ({
  sendOrderRequest: data => dispatch(newOrder(data)),
  clearLocalStorage: () => dispatch(removeCart()),
  loadCart: () => dispatch(loadCartRequest()),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(Component);

export {
  Container as Order,
  Component as OrderComponent,
};
