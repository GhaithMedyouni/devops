import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import ElementHeader from 'components/Headers/ElementHeader';
import AddClientModal from "./AddClientModal";
import EditClientModal from "./EditClientModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import countryList from 'react-select-country-list';
import { Button, Card, CardFooter, CardHeader, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import DisplayClient from "./DisplayClientModal"

const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
};

function Clients() {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);

    const token = localStorage.getItem('token');
    const decodedToken = token ? decodeToken(token) : {};
    const currentUserId = decodedToken.AdminID;

    const adminId = currentUserId;

    const countries = countryList().getData();
    const countryOptions = countries.reduce((acc, country) => {
        acc[country.value] = country.label;
        return acc;
    }, {});

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/client', {
                params: { createdBy: adminId }
            });
            setClients(response.data);
        } catch (err) {
            setError(err.message);
            toast.error('Impossible de récupérer les clients');
        }
    };

    useEffect(() => {
        fetchClients();
    }, [adminId]);

    const refreshClients = () => {
        fetchClients();
    };



    const filteredClients = clients.filter((client) =>
        (client.person && client.person.prenom.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.person && client.person.nom.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.entreprise && client.entreprise.pays.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.person && client.person.telephone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.person && client.person.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const indexOfLastClient = currentPage * clientPerPage;
    const indexOfFirstClient = indexOfLastClient - clientPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

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
            await axios.delete(`http://localhost:5000/api/client/${companyToDelete}`);
            refreshClients();
            toggleDeleteModal();
            toast.success('Client supprimée avec succès', {
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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleEditModal = () => {
        setEditModalOpen(!editModalOpen);
    };

    const handleEditClick = (client) => {
        setClientToEdit(client);
        toggleEditModal();
    };
    const toggleDisplayModal = () => {
        setDisplayModalOpen(!displayModalOpen);
    };

    const handleDisplayClick = (client) => {
        setSelectedClient(client);
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
                                <h3 className="mb-0">Liste des clients</h3>
                                <div className="d-flex">
                                    <Input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="mr-3"
                                    />
                                    <Button color="primary" onClick={toggleModal}>Ajouter un nouveau client</Button>
                                </div>
                            </CardHeader>
                            <Table className="align-items-center table-flush" >
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Type</th>
                                        <th scope="col">Nom complet</th>
                                        <th scope="col">Pays</th>
                                        <th scope="col">Téléphone</th>
                                        <th scope="col">Email</th>
                                        <th scope="col"></th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {currentClients.length > 0 ? (
                                        currentClients.map(client => (
                                            <tr key={client._id}>
                                                <td>
                                                    <span style={{
                                                        padding: '5px 10px',
                                                        borderRadius: '10px',
                                                        color: client.type === 'Person' ? '#0047AB' : '#097969',
                                                        backgroundColor: client.type === 'Person' ? '#89CFF0' : '#AFE1AF',
                                                        textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff',

                                                    }}>
                                                        {client.type}
                                                    </span>
                                                </td>
                                                <td>
                                                    {client.type === 'Person' && client.person ? client.person.prenom + ' ' + client.person.nom : client.type === 'Company' && client.entreprise ? client.entreprise.nom : 'N/A'}
                                                </td>
                                                <td>
                                                    {client.type === 'Company' && client.entreprise ? countryOptions[client.entreprise.pays] : client.type === 'Person' && client.person ? client.person.pays : 'N/A'}
                                                </td>
                                                <td>
                                                    {client.type === 'Person' && client.person ? client.person.telephone : client.type === 'Company' && client.entreprise ? client.entreprise.telephone : 'N/A'}
                                                </td>
                                                <td>
                                                    {client.type === 'Person' && client.person ? client.person.email : client.type === 'Company' && client.entreprise ? client.entreprise.email : 'N/A'}
                                                </td>

                                                <td>
                                                    <Dropdown isOpen={dropdownOpen === client._id} toggle={() => toggleDropdown(client._id)} >
                                                        <DropdownToggle tag="span" data-toggle="dropdown" style={{ cursor: 'pointer' }}>
                                                            <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '1rem' }} />
                                                        </DropdownToggle>
                                                        <DropdownMenu right style={{ marginTop: "-25px" }}>
                                                            <DropdownItem onClick={() => handleDisplayClick(client)}>
                                                                <span className="d-flex align-items-center">
                                                                    <i className="fa-solid fa-eye" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                    Afficher
                                                                </span>
                                                            </DropdownItem>
                                                            <DropdownItem onClick={() => handleEditClick(client)}>
                                                                <span className="d-flex align-items-center">
                                                                    <i className="fa-solid fa-gear" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                    Modifer
                                                                </span>
                                                            </DropdownItem>
                                                            <DropdownItem divider />
                                                            <DropdownItem onClick={() => handleDeleteClick(client._id)}>
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

                            <EditClientModal
                                isOpen={editModalOpen}
                                toggle={toggleEditModal}
                                client={clientToEdit}
                                refreshClients={refreshClients}
                                userId={currentUserId}
                            />
                            {selectedClient && (
                                <DisplayClient
                                    isOpen={displayModalOpen}
                                    toggle={toggleDisplayModal}

                                    client={selectedClient}
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
                                    {[...Array(Math.ceil(filteredClients.length / clientPerPage))].map((_, index) => (
                                        <PaginationItem key={index + 1} active={currentPage === index + 1}>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => { e.preventDefault(); paginate(index + 1); }}
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem disabled={currentPage === Math.ceil(filteredClients.length / clientPerPage)}>
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
            <AddClientModal
                isOpen={modalOpen}
                toggle={toggleModal}
                refreshClients={refreshClients}
                userId={currentUserId}
            />
        </>
    );
}

export default Clients;
