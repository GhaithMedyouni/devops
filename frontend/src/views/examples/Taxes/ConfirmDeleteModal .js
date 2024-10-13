import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ConfirmDeleteModal = ({ isOpen, toggle, onConfirm }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>Confirm Delete</ModalHeader>
    <ModalBody>Are you sure you want to delete this taxe?</ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={onConfirm}>Delete</Button>{' '}
      <Button color="secondary" onClick={toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>
);

export default ConfirmDeleteModal;
