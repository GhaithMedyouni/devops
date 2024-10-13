import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table
} from 'reactstrap';

const DisplayProductModal = ({ isOpen, toggle, product, categories,currencies }) => {

 
  const getCurrencyCodeById = (id) => {
    const currency = currencies.find(currency => currency._id === id);
    return currency ? currency.code : 'Devise non trouvée';
};

  const thStyle = {
    padding: '8px 12px',
    borderRadius: '10px',
    color: '#770737',
    backgroundColor: '#FFB6C1	',
    textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff',

  };
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
    >


      <ModalHeader toggle={toggle}>Détails du service</ModalHeader>
      <ModalBody>
        <Table responsive>
          <tbody>
            <tr>
              <th><span style={thStyle}>Nom</span></th>
              <td>{product.name}</td>
            </tr>
            
            <tr>
              <th><span style={thStyle}>Devise</span></th>
              <td>{getCurrencyCodeById(product.currency)}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Prix</span></th>
              <td>{product.price}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Déscription</span></th>
              <td>{product.description}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Référence</span></th>
              <td>{product.reference}</td>
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

export default DisplayProductModal;
