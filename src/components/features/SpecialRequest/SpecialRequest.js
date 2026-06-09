import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse, Card, Input,
} from 'reactstrap';
import clsx from 'clsx';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { saveCartRequest } from '../../../redux/cartRedux';
import styles from './SpecialRequest.module.scss';

const SpecialRequest = ({ className, saveToCart, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState('');
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const specialRequest = (id) => {
    if (request.length > 6) {
      saveToCart([request, 'request', id]);
      setRequest('');
      toggle();
      setIsOpen(false);
    }
  };

  const switched = () => setIsOpen(!isOpen);

  return (
    <>
      <div>
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle}>Special request added to car</ModalHeader>
          <ModalBody>
            You have just aded special request to car. You can have 1 special request per car. You can allways remove it and add new one.
            Thank You for chosing our company
          </ModalBody>
          <ModalFooter>
            <Button color="info" onClick={toggle}>Continue</Button>
          </ModalFooter>
        </Modal>
      </div>

      <div className={clsx(className, styles.root)}>
        < div className={styles.special} >
          {!isOpen ? <div className={styles.specialBtn} onClick={switched}>Add special request</div> : <div className={styles.specialBtn} onClick={switched}>Hide me</div>
          }
          <Collapse isOpen={isOpen}>
            <Card className={styles.cardRequest}>
              <Input className={styles.input} placeholder="minimum 7 digits" type="textarea" name="valueuest" id="valueuest" value={request} onChange={e => setRequest(e.target.value)} />
              <div className={styles.btn} onClick={() => specialRequest(id)}> Add</div>
            </Card>
          </Collapse>
        </div >
      </div>
    </>
  );
};

SpecialRequest.propTypes = {
  saveToCart: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  saveToCart: (data) => dispatch(saveCartRequest(data)),
});

export default connect(null, mapDispatchToProps)(SpecialRequest);
