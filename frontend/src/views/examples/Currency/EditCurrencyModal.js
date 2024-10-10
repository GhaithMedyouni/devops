import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faTag, faFont, faExchangeAlt, faHashtag } from '@fortawesome/free-solid-svg-icons';
import currencies from './Currencies'; // Import the currencies
import Switch from 'react-switch';

const EditCurrencyModal = ({ isOpen, toggle, currency, refreshCurrencies, userId }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [symbol, setSymbol] = useState('');
  
  const [userCurrencies, setUserCurrencies] = useState([]);

  useEffect(() => {
    const fetchUserCurrencies = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/currency`, { params: { createdBy: userId } });
        setUserCurrencies(response.data);
      } catch (error) {
        console.error("Error fetching user currencies:", error);
        toast.error('Erreur lors de la récupération des devises existantes.');
      }
    };

    if (userId) {
      fetchUserCurrencies();
    }
  }, [userId]);

  useEffect(() => {
    if (currency) {
      setName(currency.name || '');
      setCode(currency.code || '');
      setSymbol(currency.symbol || '');
      
    }
  }, [currency]);

  const handleCurrencyChange = (e) => {
    const selectedCode = e.target.value;
    setCode(selectedCode);
  
    const selectedCurrency = currencies.find(currency => currency.code === selectedCode);
    if (selectedCurrency) {
      setSymbol(selectedCurrency.symbol);
      setName(selectedCurrency.name);
    } else {
      setSymbol('');
      setName('');
    }
  };

  const handleUpdateCurrency = async () => {
    if (userCurrencies.some(curr => curr.code === code && curr._id !== currency._id)) {
      toast.error('Le code de devise existe déjà.');
      return;
    }

    try {
      const updatedCurrency = {
        name,
        code,
        symbol,
        
      };

      await axios.put(`http://localhost:5000/api/currency/${currency._id}`, updatedCurrency, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      refreshCurrencies();
      toggle();
      toast.success('La devise a été mise à jour avec succès');

    } catch (error) {
      console.error("Error updating currency:", error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        toast.error('No response received from the server.');
      } else {
        toast.error("Une erreur s'est produite lors de la mise à jour de la devise.");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-right">
      <ModalHeader toggle={toggle}>Modifier devise</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="currencyCode">Code</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faFont} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                id="currencyCode"
                value={code}
                onChange={handleCurrencyChange}
              >
                <option value="">Sélectionnez le code de devise                </option>
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="currencyName">Nom</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faTag} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="currencyName"
                value={name}
                placeholder="Entrer nom"
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label for="currencySymbol">Symbole</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faDollarSign} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="currencySymbol"
                value={symbol}
                placeholder="Entrer symbole"
                onChange={(e) => setSymbol(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
        
         
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleUpdateCurrency}>Modifier</Button>{' '}
        <Button color="secondary" onClick={toggle}>Annuler</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditCurrencyModal;
