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

const AddExpense = ({ isOpen, toggle, refreshExpenses, userId }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/depense-categories", { params: { createdBy: userId } });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userId]);

  const handleAddExpense = async () => {
    try {
      const newExpense = {
        name,
        depenseCategory: category,
        createdBy: userId,
        currency,
        price,
        description,
        reference
      };

      console.log('Adding expense:', newExpense);

      const response = await axios.post('http://localhost:5000/api/depense', newExpense, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Server response:', response);

      refreshExpenses();
      toggle();
      toast.success('Expense added successfully');
    } catch (error) {
      console.error("Error adding expense:", error);

      if (error.response) {
        console.error("Response error data:", error.response.data);
        toast.error(`Error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error("Request error data:", error.request);
        toast.error('No response received from the server.');
      } else {
        console.error("Error message:", error.message);
        toast.error('An error occurred while adding the expense.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-right">
      <ModalHeader toggle={toggle}>Add New Expense</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="expenseName">Name</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faTag} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="expenseName"
                value={name}
                placeholder="Enter expense name"
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="expenseCategory">Category</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faList} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                id="productCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Select a category</option>
                {categories
                  .filter((category) => category.enabled)
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="expenseCurrency">Currency</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faDollarSign} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="expenseCurrency"
                value={currency}
                placeholder="Enter currency (e.g., USD)"
                onChange={(e) => setCurrency(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="expenseAmount">Amount</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faMoneyBill} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="number"
                id="expenseAmount"
                value={price} 
                placeholder="Enter amount"
                onChange={(e) => setPrice(e.target.value)} 
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="expenseDescription">Description</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faFileAlt} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="textarea"
                id="expenseDescription"
                value={description}
                placeholder="Enter expense description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="expenseReference">Reference</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faBarcode} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="expenseReference"
                value={reference}
                placeholder="Enter expense reference"
                onChange={(e) => setReference(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddExpense}>Add Expense</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddExpense;
