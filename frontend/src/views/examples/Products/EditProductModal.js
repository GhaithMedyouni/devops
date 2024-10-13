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

const EditProduct = ({ isOpen, toggle, refreshProducts, product, userId }) => {
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

    if (product) {
      setName(product.name);
      setCurrency(product.currency);
      setPrice(product.price);
      setDescription(product.description);
      setReference(product.reference);
    }
  }, [product, userId]);

  const handleEditProduct = async () => {
    try {
      const updatedProduct = {
        name,
        currency,
        price,
        description,
        reference,
        createdBy: userId
      };

      await axios.put(`http://localhost:5000/api/product/${product._id}`, updatedProduct);
      refreshProducts();
      toggle();
      toast.success('Service mis à jour avec succès');
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error('Erreur lors de la mise à jour du produit. Veuillez réessayer.');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-right">
      <ModalHeader toggle={toggle}>Modifier service</ModalHeader>
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
                <option value="" disabled>Sélectionnez une devise </option>
                {currencies
                  .filter((currency) => currency.active) 
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
                placeholder="Entrer Référence "
                onChange={(e) => setReference(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleEditProduct}>Modifier</Button>{' '}
        <Button color="secondary" onClick={toggle}>Annuler</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditProduct;
