import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faTag, faFont, faExchangeAlt, faHashtag } from '@fortawesome/free-solid-svg-icons';
import currencies from './Currencies'; // Import the currencies
import Switch from 'react-switch'

const AddCurrency = ({ isOpen, toggle, refreshCurrencies, userId }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [symbol, setSymbol] = useState('');
  
  const [userCurrencies, setUserCurrencies] = useState([]); // Store the existing currencies for the user

  useEffect(() => {
    // Fetch existing currencies for the current user when component mounts
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
  

  const handleAddCurrency = async () => {
    if (userCurrencies.some(currency => currency.code === code)) {
      toast.error('La monnaie existe déjà .');
      return;
    }

    try {
      const newCurrency = {
        name,
        code,
        symbol,
        
        createdBy: userId,
      };

      const response = await axios.post('http://localhost:5000/api/currency', newCurrency, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Refresh the currency list and close the modal
      refreshCurrencies();
      toggle();
      toast.success('Devise ajoutée avec succès');

      // Reset the form fields to their initial state
      setName('');
      setCode('');
      setSymbol('');
      
      setUserCurrencies([...userCurrencies, newCurrency]); // Update local state
    } catch (error) {
      console.error("Error adding currency:", error);

      if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        toast.error('No response received from the server.');
      } else {
        toast.error("une erreur s'est produite lors de l'ajout de la devise.");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-right">
      <ModalHeader toggle={toggle}>Ajouter une devise</ModalHeader>
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
                <option value="">Sélectionnez le code de devise</option>
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
                placeholder="Entrer Symbole"
                onChange={(e) => setSymbol(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
         
         
         
          
          
         
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddCurrency}>Ajouter</Button>{' '}
        <Button color="secondary" onClick={toggle}>Annuler</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddCurrency;
