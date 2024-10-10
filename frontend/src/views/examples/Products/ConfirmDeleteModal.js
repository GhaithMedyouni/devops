import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ConfirmDeleteModal = ({ isOpen, toggle, onConfirm }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>Confirmer la suppression</ModalHeader>
    <ModalBody>Êtes-vous sûr de vouloir supprimer ce service ?</ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={onConfirm}>Supprimer</Button>{' '}
      <Button color="secondary" onClick={toggle}>Annuler</Button>
    </ModalFooter>
  </Modal>
);

export default ConfirmDeleteModal;
