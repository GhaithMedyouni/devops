import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table
} from 'reactstrap';
import Switch from 'react-switch';

const DisplayTaxModal = ({ isOpen, toggle, tax }) => {
  const thStyle = {
    padding: '8px 12px',
    borderRadius: '10px',
    color: '#770737',
    backgroundColor: '#FFB6C1',
    textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff',
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Détails de taxe</ModalHeader>
      <ModalBody>
        <Table responsive>
          <tbody>
            <tr>
              <th><span style={thStyle}>Nom</span></th>
              <td>{tax.name}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Valeur</span></th>
              <td>{tax.value}%</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Active</span></th>
              <td>
                <Switch
                  checked={tax.isActive}
                  onChange={() => {}}
                  onColor="#86d3ff"
                  offColor="#888"
                  onHandleColor="#002395"
                  offHandleColor="#d4d4d4"
                  handleDiameter={15}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={10}
                  width={30}
                  className="react-switch"
                  disabled
                />
              </td>
            </tr>
            <tr>
              <th><span style={thStyle}>Par défaut</span></th>
              <td>
                <Switch
                  checked={tax.isDefault}
                  onChange={() => {}}
                  onColor="#86d3ff"
                  offColor="#888"
                  onHandleColor="#002395"
                  offHandleColor="#d4d4d4"
                  handleDiameter={15}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={10}
                  width={30}
                  className="react-switch"
                  disabled
                />
              </td>
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

export default DisplayTaxModal;
