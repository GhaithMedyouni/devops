import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

const EditClientModal = ({ isOpen, toggle, refreshClients, userId, client }) => {
  const [clientType, setClientType] = useState('');
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    if (isOpen && client) {
      setClientType(client.type);
      fetchPersonsAndCompanies();
      if (client.type === 'Person') {
        setSelectedPerson({ value: client.person._id, label: `${client.person.prenom} ${client.person.nom}` });
      } else if (client.type === 'Company') {
        setSelectedCompany({ value: client.entreprise._id, label: client.entreprise.nom });
      }
    }
  }, [isOpen, client]);

  const fetchPersonsAndCompanies = async () => {
    try {
      const personsResponse = await axios.get('http://localhost:5000/api/people'); 
      const companiesResponse = await axios.get('http://localhost:5000/api/entreprise'); 
      setPersons(personsResponse.data);
      setCompanies(companiesResponse.data);
      filterData(personsResponse.data, companiesResponse.data);
    } catch (error) {
      toast.error('Failed to fetch persons and companies');
    }
  };

  const filterData = (persons, companies) => {
    const filteredPersonsList = persons.filter(person => person.createdBy === userId);
    const filteredCompaniesList = companies.filter(company => company.createdBy === userId);
    setFilteredPersons(filteredPersonsList);
    setFilteredCompanies(filteredCompaniesList);
  };

  const handleClientTypeChange = (e) => {
    setClientType(e.target.value);
    setSelectedPerson(null);
    setSelectedCompany(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedClient = {
        type: clientType,
        entreprise: clientType === 'Company' ? selectedCompany?.value : null,
        person: clientType === 'Person' ? selectedPerson?.value : null,
        createdBy: userId
      };
      await axios.put(`http://localhost:5000/api/client/${client._id}`, updatedClient); 
      toast.success('Client modifié avec succès');
      refreshClients();
      toggle();
    } catch (error) {
      toast.error('Failed to fetch persons and companies');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} fade={true} className="custom-modal">
      <ModalHeader toggle={toggle}>Modifer Client</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="clientType">Type</Label>
            <Input
              type="select"
              name="clientType"
              id="clientType"
              value={clientType}
              onChange={handleClientTypeChange}
              required
            >
              <option value="">Selectionnez un Type</option>
              <option value="Person">Person</option>
              <option value="Company">Entreprise</option>
            </Input>
          </FormGroup>
          {clientType === 'Person' && (
            <FormGroup>
              <Label for="person">Person</Label>
              <Select
                id="person"
                options={filteredPersons.length > 0 ? filteredPersons.map(person => ({ value: person._id, label: `${person.prenom} ${person.nom}` })) : [{ value: '', label: 'No persons added by you' }]}
                value={selectedPerson}
                onChange={setSelectedPerson}
                isClearable
                placeholder="Search"
                isDisabled={filteredPersons.length === 0}
              />
            </FormGroup>
          )}
          {clientType === 'Company' && (
            <FormGroup>
              <Label for="company">Entreprise</Label>
              <Select
                id="company"
                options={filteredCompanies.length > 0 ? filteredCompanies.map(company => ({ value: company._id, label: company.nom })) : [{ value: '', label: 'No companies added by you' }]}
                value={selectedCompany}
                onChange={setSelectedCompany}
                isClearable
                placeholder="Search"
                isDisabled={filteredCompanies.length === 0}
              />
            </FormGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">Enregister</Button>{' '}
          <Button color="secondary" onClick={toggle}>Annuler</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default EditClientModal;
