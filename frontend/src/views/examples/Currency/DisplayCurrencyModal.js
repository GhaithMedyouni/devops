import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table
} from 'reactstrap';

const DisplayCurrencyModal = ({ isOpen, toggle, currency }) => {

  const thStyle = {
    padding: '8px 12px',
    borderRadius: '10px',
    color: '#770737',
    backgroundColor: '#FFB6C1',
    textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff',
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
    >
      <ModalHeader toggle={toggle}>Détails de devise</ModalHeader>
      <ModalBody>
        <Table responsive>
          <tbody>
            <tr>
              <th><span style={thStyle}>Nom</span></th>
              <td>{currency.name}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Code</span></th>
              <td>{currency.code}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Symbole</span></th>
              <td>{currency.symbol}</td>
            </tr>
            
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Fermer
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DisplayCurrencyModal;
