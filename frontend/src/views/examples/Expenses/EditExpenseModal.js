import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, Label } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditExpenseModal = ({ isOpen, toggle, expense, refreshExpenses, refreshCategories, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    depenseCategory: '',
    currency: '',
    price: '',
    description: '',
    reference: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        name: expense.name || '',
        depenseCategory: expense.depenseCategory?._id || '',
        currency: expense.currency || '',
        price: expense.price || '',
        description: expense.description || '',
        reference: expense.reference || '',
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/depense/${expense._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      refreshExpenses();
      toggle();
      toast.success('Expense updated successfully', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error('Failed to update expense', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Expense</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="depenseCategory">Category</Label>
          <Input
            type="select"
            name="depenseCategory"
            id="depenseCategory"
            value={formData.depenseCategory}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="currency">Currency</Label>
          <Input
            type="text"
            name="currency"
            id="currency"
            value={formData.currency}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="price">Price</Label>
          <Input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="reference">Reference</Label>
          <Input
            type="text"
            name="reference"
            id="reference"
            value={formData.reference}
            onChange={handleChange}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>Save Changes</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditExpenseModal;
