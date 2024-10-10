import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from 'reactstrap';
import ToggleSwitch from './ToggleSwitch';

const DisplayProductCategoryModal = ({ isOpen, toggle, category }) => {
  const thStyle = {
    padding: '8px 12px',
    borderRadius: '10px',
    color: '#770737',
    backgroundColor: '#FFB6C1',
    textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff',
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Product Category Details</ModalHeader>
      <ModalBody>
        <Table responsive>
          <tbody>
            <tr>
              <th><span style={thStyle}>Name</span></th>
              <td>{category.name}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Description</span></th>
              <td>{category.description}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Color</span></th>
              <td>{category.color}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Enabled</span></th>
              <td><ToggleSwitch isChecked={category.enabled} /></td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DisplayProductCategoryModal;
