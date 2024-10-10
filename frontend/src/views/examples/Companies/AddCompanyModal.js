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
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import Flag from 'react-world-flags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faGlobe, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};

const validatePhoneNumber = (number, countryCode) => {
  if (!countryCode || !number) return false;

  const phoneNumber = parsePhoneNumberFromString(number, countryCode);
  return phoneNumber ? phoneNumber.isValid() : false;
};

const AddCompanyModal = ({ isOpen, toggle, refreshCompany, userId }) => {
  const [nom, setNom] = useState("");
  const [pays, setPays] = useState(null);
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [siteweb, setSiteweb] = useState("");
  const [mainContact, setMainContact] = useState(null);
  const [people, setPeople] = useState([]);
  const [rib, setRib] = useState("");
  const [fisc, setFisc] = useState("");



  const token = localStorage.getItem('token');
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;

  const countryOptions = countryList().getData().map(country => ({
    value: country.value,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Flag code={country.value} style={{ width: 20, marginRight: 10 }} />
        {country.label}
      </div>
    )
  }));

  useEffect(() => {
    if (isOpen) {
      fetchPeople();
    }
  }, [isOpen]);

  const fetchPeople = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/people");
      setPeople(response.data.filter(person => person.createdBy === currentUserId));
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const handleCountryChange = (selectedOption) => {
    setPays(selectedOption);

    const countryCode = selectedOption?.value ? `+${getCountryCallingCode(selectedOption.value)}` : "";

    setTelephone((prev) => {
      const numberWithoutCode = prev.replace(/^\+\d+\s*/, '');
      return `${countryCode} ${numberWithoutCode}`;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(telephone, pays?.value)) {
      toast.error('Numéro de téléphone invalide pour le pays sélectionné. Veuillez vérifier le numéro et réessayer', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const newCompany = {
      nom,
      pays: pays ? pays.value : "",
      telephone,
      email,
      siteweb,
      createdBy: userId,
      mainContact,
      rib,
      fisc
    };

    try {
      const response = await axios.post("http://localhost:5000/api/entreprise", newCompany);
      refreshCompany();
      toggle();
      toast.success('Entreprise ajoutée avec succès.', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setNom("");
      setPays(null);
      setTelephone("");
      setEmail("");
      setSiteweb("");
      setRib("");
      setFisc("");


      setMainContact(null);
    } catch (error) {
      console.error("Error creating new company:", error.response || error.message);
      toast.error("Erreur lors de la création de l'entreprise. Veuillez réessayer", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const filterOption = (option, inputValue) => {
    return option.label.props.children[1].toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} fade={true} className="custom-modal">
      <ModalHeader toggle={toggle}>Ajouter une nouvelle entreprise</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="nom">Nom</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faBuilding} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Entrer nom"
                required
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="pays">Pays</Label>
            <Select
              options={countryOptions}
              value={pays}
              onChange={handleCountryChange}
              placeholder="Selectionnez pays"
              isClearable
              isSearchable
              filterOption={filterOption}
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
            />
          </FormGroup>
          <FormGroup>
            <Label for="telephone">Téléphone</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faPhone} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Entrer téléphone"
                required
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faEnvelope} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrer email"
                required
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="siteweb">Site Web</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faGlobe} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="siteweb"
                value={siteweb}
                onChange={(e) => setSiteweb(e.target.value)}
                placeholder="Entrer Siteweb"
                required
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="rib">RIB</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faGlobe} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="rib"
                value={rib}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (/^\d*$/.test(newValue) && newValue.length <= 20) {
                    setRib(newValue);
                  }
                }}
                placeholder="Entrer RIB"
                required
                pattern="\d{20}" 
                maxLength="20" 
                title="Le RIB doit comporter exactement 20 chiffres."
              />
            </InputGroup>
          </FormGroup>


          <FormGroup>
            <Label for="fisc">Matricul fiscal</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faGlobe} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="fisc"
                value={fisc}
                onChange={(e) => setFisc(e.target.value)}
                placeholder="Entrer matricul fiscal"
                required
              />
            </InputGroup>
          </FormGroup>


        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">Enregistrer</Button>{' '}
          <Button color="secondary" onClick={toggle}>Annuler</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddCompanyModal;
