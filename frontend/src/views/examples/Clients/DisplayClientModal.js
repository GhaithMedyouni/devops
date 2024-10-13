import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table
} from 'reactstrap';
import countryList from 'react-select-country-list'; 

const DisplayCompanyModal = ({ isOpen, toggle, client }) => {

  const countryOptions = countryList().getData();
  const countryMap = countryOptions.reduce((acc, country) => {
    acc[country.value] = country.label;
    return acc;
  }, {});

  const thStyle = {
    padding: '8px 12px',
    borderRadius: '10px',
    color: '#770737',
    backgroundColor: '#FFB6C1',
    textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff',
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Détails du client</ModalHeader>
      <ModalBody>
        <Table responsive>
          <tbody>
            <tr>
              <th><span style={thStyle}>Type</span></th>
              <td>{client.type}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Nom complet</span></th>
              <td>
                {client.type === 'Person' && client.person ? 
                  `${client.person.prenom} ${client.person.nom}` : 
                  client.type === 'Company' && client.entreprise ? 
                  client.entreprise.nom : 'N/A'
                }
              </td>
            </tr>
            <tr>
              <th><span style={thStyle}>Pays</span></th>
              <td>
                {client.type === 'Company' && client.entreprise ? 
                  (countryMap[client.entreprise.pays] || client.entreprise.pays) : 
                  client.type === 'Person' && client.person ? 
                  (countryMap[client.person.pays] || client.person.pays) : 
                  'N/A'
                }
              </td>
            </tr>
            <tr>
              <th><span style={thStyle}>Téléphone</span></th>
              <td>
                {client.type === 'Person' && client.person ? 
                  client.person.telephone : 
                  client.type === 'Company' && client.entreprise ? 
                  client.entreprise.telephone : 'N/A'
                }
              </td>
            </tr>
            <tr>
              <th><span style={thStyle}>Email</span></th>
              <td>
                {client.type === 'Person' && client.person ? 
                  client.person.email : 
                  client.type === 'Company' && client.entreprise ? 
                  client.entreprise.email : 'N/A'
                }
              </td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Fermer
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DisplayCompanyModal;
