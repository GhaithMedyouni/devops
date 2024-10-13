import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  FormGroup,
  Label
} from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Switch from 'react-switch';
import { colorOptions } from './colorOptions';

const isColorLight = (color) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

const EditCategoryModal = ({ isOpen, toggle, category, refreshCategories }) => {
  const [nom, setNom] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [color, setColor] = useState(null); 
  const [enabled, setEnabled] = useState(category?.enabled || true);

  useEffect(() => {
    if (category) {
      const normalizedColor = category.color.charAt(0).toUpperCase() + category.color.slice(1).toLowerCase(); 
  
      const selectedColor = colorOptions.find(c => c.value === normalizedColor);
  
      if (!selectedColor) {
        console.warn("Color not found in options:", normalizedColor);
      }
  
      setNom(category.name || "");
      setDescription(category.description || "");
      setColor(selectedColor || colorOptions[0]);
      setEnabled(category.enabled || true);
    }
  }, [category]);
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!color) {
      toast.error('Please select a color');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/depense-categories/${category._id}`, {
        name: nom,
        description,
        color: color.value,
        enabled
      });
      toggle();
      refreshCategories();
      toast.success('Category updated successfully');
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error('Error updating category');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} fade={true} className="custom-modal">
      <ModalHeader toggle={toggle}>Edit Product Category</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="nom">Category Name</Label>
            <Input
              type="text"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="color">Color</Label>
            <Select
              id="color"
              options={colorOptions}
              value={color}
              onChange={(selectedOption) => setColor(selectedOption)}
              isClearable={false}
              placeholder="Select a color"
              formatOptionLabel={(option) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      backgroundColor: option.hex,
                      padding: '5px 10px',
                      borderRadius: '25px',
                      color: isColorLight(option.hex) ? '#000' : '#fff',
                    }}
                  >
                    {option.label}
                  </div>
                </div>
              )}
            />
          </FormGroup>
          <FormGroup>
            <Label for="enabled">Enabled</Label>
            <div>
              <Switch
                onChange={setEnabled}
                checked={enabled}
                id="enabled"
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
              />
            </div>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Save
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
