import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  FormGroup,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupText
} from "reactstrap";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCompanyModal from "../Companies/AddCompanyModal";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { parsePhoneNumber } from 'libphonenumber-js';
import Flag from 'react-world-flags';

const EditPersonModal = ({ isOpen, toggle, person, refreshPeople, refreshCompanies, userId }) => {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [company, setCompany] = useState("");
  const [pays, setPays] = useState(null);
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [cin, setCin] = useState("");
  const [companies, setCompanies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);

  const [initialEmail, setInitialEmail] = useState("");
  const [initialPhone, setInitialPhone] = useState("");

  const options = countryList().getData();

  useEffect(() => {
    fetchCompanies();
    if (person) {
      setPrenom(person.prenom);
      setNom(person.nom);
      setCompany(person.entreprise);
      setPays(options.find(option => option.label === person.pays));
      setTelephone(person.telephone);
      setEmail(person.email);
      setCin(person.cin)

      setInitialEmail(person.email);
      setInitialPhone(person.telephone);
    }
  }, [person, userId, options]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/entreprise`);
      const filteredCompanies = response.data.filter(company => company.createdBy === userId);
      setCompanies(filteredCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAddCompanyModal = () => setAddCompanyModalOpen(!addCompanyModalOpen);

  const handleCompanyChange = (companyId) => {
    setCompany(companyId);
    toggleDropdown();
  };

  const checkUniqueness = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/people", {
        params: { createdBy: userId }
      });
      const userPersons = response.data;

      const isEmailUnique = !userPersons.some(p => p.email === email && p._id !== person._id);
      const isPhoneUnique = !userPersons.some(p => p.telephone === telephone && p._id !== person._id);

      if (!isEmailUnique) {
        toast.error("L'email existe déjà parmi vos contacts. Veuillez utiliser un autre email.", {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }

      if (!isPhoneUnique) {
        toast.error('Le numéro de téléphone existe déjà parmi vos contacts. Veuillez utiliser un autre numéro de téléphone.', {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking uniqueness:", error);
      toast.error("Erreur lors de la vérification de l'unicité. Veuillez réessayer.", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    }
  };

  const validatePhoneNumber = (phoneNumber, countryCode) => {
    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
      return phoneNumberObj.isValid();
    } catch (error) {
      console.error("Phone number validation error:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pays) {
      const countryCode = pays.value;
      if (!validatePhoneNumber(telephone, countryCode)) {
        toast.error(`Numéro de téléphone invalide pour ${pays.label}. Veuillez vérifier le format du numéro.`, {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }

    const emailChanged = email !== initialEmail;
    const phoneChanged = telephone !== initialPhone;

    if (emailChanged || phoneChanged) {
      const isUnique = await checkUniqueness();
      if (!isUnique) return;
    }

    const updatedPerson = {
      prenom,
      nom,
      entreprise: company,
      pays: pays?.label,
      telephone,
      email,
      cin
    };

    try {
      await axios.put(`http://localhost:5000/api/people/${person._id}`, updatedPerson);
      refreshPeople();
      refreshCompanies();
      toggle();
      toast.success('Personne mise à jour avec succès.', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error updating person:", error);
      toast.error('Erreur lors de la mise à jour de la personne. Veuillez réessayer.', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const getPhoneNumberPlaceholder = () => {
    if (pays) {
      const countryCode = pays.value;
      try {
        const exampleNumber = parsePhoneNumber('', countryCode);
        return `e.g., ${exampleNumber.formatNational()}`;
      } catch (error) {
        return 'Entrer téléphone';
      }
    }
    return 'Entrer téléphone';
  };

  const customSingleValue = ({ data }) => (
    <div className="custom-single-value">
      <Flag code={data.value} alt={data.label} style={{ width: 20, marginRight: 10 }} />
      {data.label}
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="custom-option">
        <Flag code={data.value} alt={data.label} style={{ width: 20, marginRight: 10 }} />
        {data.label}
      </div>
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} fade={true} className="custom-modal">
        <ModalHeader toggle={toggle}>Modifier personne</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="prenom">Nom</Label>
              <InputGroup>
                <InputGroupText style={{ backgroundColor: '#fff', border: '1px solid #ced4da', borderRight: 0, borderRadius: '0.25rem 0 0 0.25rem' }}>
                  <i className="ni ni-single-02"></i>
                </InputGroupText>
                <Input
                  type="text"
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Entrer le nom"
                  required
                  style={{ borderLeft: 0, borderRadius: '0 0.25rem 0.25rem 0', transition: 'border-color 0.2s' }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="nom">Prénom</Label>
              <InputGroup>
                <InputGroupText style={{ backgroundColor: '#fff', border: '1px solid #ced4da', borderRight: 0, borderRadius: '0.25rem 0 0 0.25rem' }}>
                  <i className="ni ni-hat-3"></i>
                </InputGroupText>
                <Input
                  type="text"
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Entrer le prénom"
                  required
                  style={{ borderLeft: 0, borderRadius: '0 0.25rem 0.25rem 0', transition: 'border-color 0.2s' }}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label for="cin">CIN</Label>
              <InputGroup>
                <InputGroupText style={{ backgroundColor: '#fff', border: '1px solid #ced4da', borderRight: 0, borderRadius: '0.25rem 0 0 0.25rem' }}>
                  <i className="ni ni-single-02"></i>
                </InputGroupText>
                <Input
                  type="text"
                  id="cin"
                  value={cin}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (/^\d*$/.test(newValue) && newValue.length <= 8) {
                      setCin(newValue);
                    }
                  }}
                  placeholder="Entrer le CIN"
                  required
                  pattern="\d{8}" // Enforces 8 digits
                  maxLength="8" // Restricts the input to 8 characters
                  title="Le CIN doit comporter exactement 8 chiffres."
                  style={{ borderLeft: 0, borderRadius: '0 0.25rem 0.25rem 0', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#80bdff'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                />
              </InputGroup>
            </FormGroup>



            <FormGroup>
              <Label for="company">Entreprise</Label>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret>
                  {companies.find(c => c._id === company)?.nom || "Sélectionnez une entreprise"}
                </DropdownToggle>
                <DropdownMenu>
                  {companies.map((comp) => (
                    <DropdownItem key={comp._id} onClick={() => handleCompanyChange(comp._id)}>
                      {comp.nom}
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem onClick={toggleAddCompanyModal}>
                  Ajouter une nouvelle entreprise.
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </FormGroup>
            <FormGroup>
              <Label for="pays">Pays</Label>
              <Select
                id="pays"
                options={options}
                value={pays}
                onChange={setPays}
                placeholder="Sélectionnez un pays"
                components={{ SingleValue: customSingleValue, Option: customOption }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="telephone">Téléphone</Label>
              <InputGroup>
                <InputGroupText style={{ backgroundColor: '#fff', border: '1px solid #ced4da', borderRight: 0, borderRadius: '0.25rem 0 0 0.25rem' }}>
                  <i className="ni ni-mobile-button"></i>
                </InputGroupText>
                <Input
                  type="text"
                  id="telephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder={getPhoneNumberPlaceholder()}
                  required
                  style={{ borderLeft: 0, borderRadius: '0 0.25rem 0.25rem 0', transition: 'border-color 0.2s' }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <InputGroup>
                <InputGroupText style={{ backgroundColor: '#fff', border: '1px solid #ced4da', borderRight: 0, borderRadius: '0.25rem 0 0 0.25rem' }}>
                  <i className="ni ni-email-83"></i>
                </InputGroupText>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrer email"
                  required
                  style={{ borderLeft: 0, borderRadius: '0 0.25rem 0.25rem 0', transition: 'border-color 0.2s' }}
                />
              </InputGroup>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>Annuler</Button>
            <Button color="primary" type="submit">Enregister</Button>
          </ModalFooter>
        </Form>
      </Modal>
      <AddCompanyModal isOpen={addCompanyModalOpen} toggle={toggleAddCompanyModal} refreshCompanies={fetchCompanies} />
    </>
  );
};

export default EditPersonModal;
