import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table
} from "reactstrap";
import ElementHeader from "components/Headers/ElementHeader";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import AddCompanyModal from "./AddCompanyModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditCompanyModal from "./EditCompanyModal";
import countryList from 'react-select-country-list';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import DisplayCompany from "./DisplayCompanyModal"


const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [people, setPeople] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonWidth, setButtonWidth] = useState('auto');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [displayModalOpen, setDisplayModalOpen] = useState(false);



  const token = localStorage.getItem('token');
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;

  const countries = countryList().getData();
  const countryOptions = countries.reduce((acc, country) => {
    acc[country.value] = country.label;
    return acc;
  }, {});

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/entreprise");
      const filteredCompanies = response.data.filter(company => company.createdBy === currentUserId);
      setCompanies(filteredCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchPeople = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/people");
      setPeople(response.data.filter(person => person.createdBy === currentUserId));
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchPeople();
  }, []);

  const refreshCompany = () => {
    fetchCompanies();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getMainContact = (companyId) => {
    const mainContacts = people.filter(person => person.entreprise === companyId);
    if (mainContacts.length === 0) {
      return <span style={{ color: 'red' }}>Aucun contact principal disponible</span>;
    }
    return (
      <span style={{
        display: 'inline-block',
        backgroundColor: '#b3d7ff',
        color: '#0056b3',
        padding: '5px 10px',
        borderRadius: '5px',
        textAlign: 'center'
      }}>
        {mainContacts[0].prenom} {mainContacts[0].nom}
      </span>
    );
  };

  const filteredCompanies = companies.filter((company) =>
    (company.nom && company.nom.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (company.pays && company.pays.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (company.telephone && company.telephone.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (company.email && company.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setButtonWidth('100%');
      } else {
        setButtonWidth('auto');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const handleDeleteClick = (id) => {
    setCompanyToDelete(id);
    toggleDeleteModal();
  };

  const confirmDeleteCompany = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/entreprise/${companyToDelete}`);
      refreshCompany();
      toggleDeleteModal();
      toast.success('Entreprise supprimée avec succès.', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditClick = (company) => {
    setCompanyToEdit(company);
    toggleEditModal();
  };
  const toggleDisplayModal = () => {
    setDisplayModalOpen(!displayModalOpen);
  };

  const handleDisplayClick = (company) => {
    setSelectedCompany(company);
    toggleDisplayModal();
  };

  return (
    <>
      <ToastContainer />

      <ElementHeader />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Liste des entreprises</h3>
                <div className="d-flex">
                  <Input
                    type="text"
                    placeholder="Rechercher"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mr-3"
                  />
                  <Button color="primary" style={{ width: buttonWidth }} onClick={toggleModal}>Ajouter une nouvelle entreprise</Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" >
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Contact principal</th>
                    <th scope="col">Pays</th>
                    <th scope="col">Téléphone</th>
                    <th scope="col">Email</th>
                    <th scope="col">Site WEb</th>
                    <th scope="col">RIB</th>
                    <th scope="col">Matricul <br/> fiscal</th>


                    <th scope="col"></th>

                  </tr>
                </thead>
                <tbody>
                  {currentCompanies.length > 0 ? (
                    currentCompanies.map((company) => (
                      <tr key={company._id}>
                        <td>{company.nom}</td>
                        <td>{getMainContact(company._id)}</td>
                        <td>{countryOptions[company.pays] || company.pays}</td>
                        <td>{company.telephone}</td>
                        <td>{company.email}</td>
                        <td><a target="_blank" href={company.siteweb}>{company.siteweb}</a></td>
                        <td>{company.rib}</td>
                        <td>{company.fisc}</td>

                        <td>
                          <Dropdown isOpen={dropdownOpen === company._id} toggle={() => toggleDropdown(company._id)} >
                            <DropdownToggle tag="span" data-toggle="dropdown" style={{ cursor: 'pointer' }}>
                              <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '1rem' }} />
                            </DropdownToggle>
                            <DropdownMenu right style={{ marginTop: "-25px" }}>
                              <DropdownItem onClick={() => handleDisplayClick(company)}>
                                <span className="d-flex align-items-center">
                                  <i className="fa-solid fa-eye" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                  Afficher
                                </span>
                              </DropdownItem>
                              <DropdownItem onClick={() => handleEditClick(company)}>
                                <span className="d-flex align-items-center">
                                  <i className="fa-solid fa-gear" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                  Modifier
                                </span>
                              </DropdownItem>
                              <DropdownItem divider />
                              <DropdownItem onClick={() => handleDeleteClick(company._id)}>
                                <span className="d-flex align-items-center">
                                  <i className="fa-solid fa-trash text-danger" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                  Supprimer
                                </span>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">
                        <div style={{ textAlign: 'center' }}>
                          <i className="fa-solid fa-ban" style={{ display: 'block', marginBottom: '10px', fontSize: '50px', opacity: '0.5' }}></i>
                          <span className="text-danger">Aucun enregistrement correspondant n'a été trouvé</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                toggle={toggleDeleteModal}
                onConfirm={confirmDeleteCompany}
              />
              <EditCompanyModal
                isOpen={editModalOpen}
                toggle={toggleEditModal}
                company={companyToEdit}
                refreshCompany={refreshCompany}
                userId={currentUserId}
              />

              {selectedCompany && (
                <DisplayCompany
                  isOpen={displayModalOpen}
                  toggle={toggleDisplayModal}
                  company={selectedCompany}
                  people={people}
                />
              )}

              <CardFooter className="py-4">
                <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink
                      href="#pablo"
                      onClick={(e) => { e.preventDefault(); paginate(currentPage - 1); }}
                    >
                      <i className="fas fa-chevron-left" />
                      <span className="sr-only">Previous</span>
                    </PaginationLink>
                  </PaginationItem>
                  {[...Array(Math.ceil(filteredCompanies.length / companiesPerPage))].map((_, index) => (
                    <PaginationItem key={index + 1} active={currentPage === index + 1}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => { e.preventDefault(); paginate(index + 1); }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem disabled={currentPage === Math.ceil(filteredCompanies.length / companiesPerPage)}>
                    <PaginationLink
                      href="#pablo"
                      onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }}
                    >
                      <i className="fas fa-chevron-right" />
                      <span className="sr-only">Next</span>
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
      <AddCompanyModal
        isOpen={modalOpen}
        toggle={toggleModal}
        refreshCompany={refreshCompany}
        userId={currentUserId}
      />
    </>
  );
};

export default Company;
