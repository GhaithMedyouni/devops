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
import Select from 'react-select';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCompanyModal from "../Companies/AddCompanyModal";
import countryList from 'react-select-country-list';
import { getCountryCallingCode, parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import Flag from 'react-world-flags';

const AddPersonModal = ({ isOpen, toggle, refreshPeople, userId }) => {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [company, setCompany] = useState("");
  const [pays, setPays] = useState(null);
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [cin, setCin] = useState("");
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);

  const options = countryList().getData();

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
    }
  }, [isOpen]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/entreprise");
      const allCompanies = response.data;
      setCompanies(allCompanies);
      const userCompanies = allCompanies.filter(company => company.createdBy === userId);
      setFilteredCompanies(userCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAddCompanyModal = () => setAddCompanyModalOpen(!addCompanyModalOpen);

  const handleCountryChange = (selectedOption) => {
    setPays(selectedOption);

    const countryCode = selectedOption?.value ? `+${getCountryCallingCode(selectedOption.value)}` : "";

    setTelephone((prev) => {
      const prevWithoutCode = prev.replace(/^\+\d+\s*/, '');
      return `${countryCode} ${prevWithoutCode}`;
    });
  };

  const validatePhoneNumber = (phoneNumber, countryCode) => {
    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
      return phoneNumberObj.isValid();
    } catch (error) {
      return false;
    }
  };

  const checkUniqueness = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/people", {
        params: { createdBy: userId }
      });

      const userPersons = response.data.filter(person => person.createdBy === userId);;

      const isEmailUnique = !userPersons.some(person => person.email === email);

      if (!isEmailUnique) {
        toast.error("L'email existe déjà parmi vos contacts. Veuillez utiliser un email différent", {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }

      const isPhoneUnique = !userPersons.some(person => person.telephone === telephone);

      if (!isPhoneUnique) {
        toast.error('Le numéro de téléphone existe déjà parmi vos contacts. Veuillez utiliser un numéro de téléphone différent.', {
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

    const isUnique = await checkUniqueness();
    if (!isUnique) return;

    const newPerson = {
      prenom,
      nom,
      pays: pays?.label,
      telephone,
      email,
      cin,
      createdBy: userId
    };

    if (company) {
      newPerson.entreprise = company;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/people", newPerson);
      refreshPeople();
      toggle();
      resetForm();
      toast.success('Personne ajoutée avec succès', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error creating new person:", error.response ? error.response.data : error.message);
      toast.error('Erreur lors de la création de la personne. Veuillez réessayer.', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const resetForm = () => {
    setPrenom("");
    setNom("");
    setCompany("");
    setPays(null);
    setTelephone("");
    setEmail("");
    setCin("");

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
        <ModalHeader toggle={toggle}>Ajouter une nouvelle personne</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
          <FormGroup>
              <Label for="nom">Nom</Label>
              <InputGroup>
                <InputGroupText style={{ backgroundColor: '#fff', border: '1px solid #ced4da', borderRight: 0, borderRadius: '0.25rem 0 0 0.25rem' }}>
                  <i className="ni ni-hat-3"></i>
                </InputGroupText>
                <Input
                  type="text"
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Entrez le nom"
                  required
                  style={{ borderLeft: 0, borderRadius: '0 0.25rem 0.25rem 0', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#80bdff'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="prenom">Prénom</Label>
              <InputGroup>
                <InputGroupText style={{ backgroundColor: '#fff', border: '1px solid #ced4da', borderRight: 0, borderRadius: '0.25rem 0 0 0.25rem' }}>
                  <i className="ni ni-single-02"></i>
                </InputGroupText>
                <Input
                  type="text"
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Entrez le prénom"
                  required
                  style={{ borderLeft: 0, borderRadius: '0 0.25rem 0.25rem 0', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#80bdff'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
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
                  placeholder="Entrez le CIN"
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
                  {company ? companies.find(comp => comp._id === company)?.nom : "Sélectionnez une entreprise"}
                </DropdownToggle>
                <DropdownMenu>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map(comp => (
                      <DropdownItem key={comp._id} onClick={() => setCompany(comp._id)}>
                        {comp.nom}
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem disabled>Aucune entreprise disponible</DropdownItem>
                  )}
                  <DropdownItem divider />
                  <DropdownItem onClick={toggleAddCompanyModal} className="d-flex align-items-center">
                    <span className="ni ni-fat-add text-blue mr-2" style={{ fontSize: '24px' }}></span>
                    Ajouter une nouvelle entreprise
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </FormGroup>
            <FormGroup>
              <Label for="pays">Pays</Label>
              <Select
                options={options}
                value={pays}
                onChange={handleCountryChange}
                placeholder="Sélectionnez un pays"
                isClearable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: '1px solid #ced4da',
                    borderRadius: '0.25rem',
                    transition: 'border-color 0.2s'
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999
                  })
                }}
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
                  placeholder="Entrez le numéro de téléphone"
                  required
                  style={{ borderLeft: 0, borderRadius: '0 0.25rem 0.25rem 0', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#80bdff'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
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
                  placeholder="Entrez l'adresse e-mail."
                  required
                  style={{ borderLeft: 0, borderRadius: '0 0.25rem 0.25rem 0', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#80bdff'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                />
              </InputGroup>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">Enregister</Button>{' '}
            <Button color="secondary" onClick={() => { toggle(); resetForm(); }}>Annuler</Button>
          </ModalFooter>
        </Form>
      </Modal>

      <AddCompanyModal
        isOpen={addCompanyModalOpen}
        toggle={toggleAddCompanyModal}
        refreshCompany={() => {
          fetchCompanies();
          toggleAddCompanyModal();
        }}
        userId={userId}
      />
    </>
  );
};

export default AddPersonModal;
