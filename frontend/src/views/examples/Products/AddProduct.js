import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faList, faDollarSign, faMoneyBill, faFileAlt, faBarcode } from '@fortawesome/free-solid-svg-icons';

const AddProduct = ({ isOpen, toggle, refreshProducts, userId }) => {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [currencies, setCurrencies] = useState([]);

  

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/currency", { params: { createdBy: userId } });
      setCurrencies(response.data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [userId]);

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        name,
        currency,
        price,
        description,
        reference,
        createdBy: userId
      };

      await axios.post('http://localhost:5000/api/product', newProduct);
      refreshProducts();
      toggle();
      toast.success('Produit ajouté avec succès');
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Erreur lors de l'ajout du produit. Veuillez réessayer.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-right">
      <ModalHeader toggle={toggle}>Ajouter un service</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="productName">Nom</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faTag} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="productName"
                value={name}
                placeholder="Entrer nom"
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          
          <FormGroup>
            <Label for="productCurrency">Devise</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faDollarSign} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                id="productCurrency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="" disabled>Sélectionnez une devise</option>
                {currencies
                  .map((currency) => (
                    <option key={currency._id} value={currency._id}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="productPrice">Prix</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faMoneyBill} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="number"
                id="productPrice"
                value={price}
                placeholder="Entrer prix"
                onChange={(e) => setPrice(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="productDescription">Déscription</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faFileAlt} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="textarea"
                id="productDescription"
                value={description}
                placeholder="Entrer description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="productReference">Référence</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faBarcode} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="productReference"
                value={reference}
                placeholder="Entrer référence"
                onChange={(e) => setReference(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddProduct}>Ajouter</Button>{' '}
        <Button color="secondary" onClick={toggle}>Annuler</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddProduct;
