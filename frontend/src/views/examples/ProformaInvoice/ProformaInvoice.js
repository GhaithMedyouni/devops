import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardHeader,
    Input,
    Table,
    Container,
    Row,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Pagination,
    PaginationItem,
    PaginationLink,
    CardFooter,
    Badge,
} from "reactstrap";
import Header from "components/Headers/ElementHeader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import DisplayProformaInvoicemodal from "../ProformaInvoice/DisplayProformaInvoicemodal";
import AddProformaInvoice from "../ProformaInvoice/AddProformaInvoice";
import EditProformaInvoiceModal from "../ProformaInvoice/EditProformaInvoiceModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import PaymentModal from "./payment";


const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
};

const ProformaInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [invoicesPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [invoiceToEdit, setInvoiceToEdit] = useState(null);
    const [taxe, setTaxe] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [invoiceToPay, setInvoiceToPay] = useState(null);

    const [selectedType, setSelectedType] = useState(''); 
    const [selectedStatus, setSelectedStatus] = useState('');
    const token = localStorage.getItem('token');
    const decodedToken = token ? decodeToken(token) : {};
    const currentUserId = decodedToken.AdminID;
    const username = decodedToken.name;
    const userlastname = decodedToken.surname;

    const fetchInvoices = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/invoices/${currentUserId}`, {
                params: {
                    type: selectedType || undefined, 
                    status: selectedStatus || undefined, 
                }
            });

            setInvoices(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };


    const refreshInvoices = () => {
        fetchInvoices();
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/client', {
                params: { createdBy: currentUserId }
            });
            setClients(response.data);
            console.log(response.data);
        } catch (err) {
            toast.error('Impossible de récupérer les clients');
        }
    };

    const fetchTaxes = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/taxes", { params: { createdBy: currentUserId } });
            setTaxe(response.data);
        } catch (error) {
            console.error("Error fetching taxes:", error);
        }
    };

    const fetchCurrencies = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/currency", {
                params: { createdBy: currentUserId },
            });
            setCurrencies(response.data);
        } catch (error) {
            console.error("Error fetching currencies:", error);
        }
    };

    const getClientNameById = (clientId) => {
        const client = clients.find(client => client._id === clientId);
        if (!client) return 'Client non trouvé';

        if (client.type === 'Person' && client.person) {
            return `${client.person.prenom} ${client.person.nom}`;
        } else if (client.type === 'Company' && client.entreprise) {
            return client.entreprise.nom;
        } else {
            return 'Type de client non reconnu';
        }
    };

    useEffect(() => {
        fetchInvoices();
        fetchClients();
        fetchTaxes();
        fetchCurrencies();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDeleteClick = (id) => {
        setInvoiceToDelete(id);
        toggleDeleteModal();
    };

    const confirmDeleteInvoice = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/invoices/${invoiceToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            refreshInvoices();
            toggleDeleteModal();
            toast.success('Invoice deleted successfully');
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };

    const filteredInvoices = invoices.filter((invoice) => {
        return (
            invoice?.type === 'Proforma' &&
            (
                invoice?.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                invoice?.number?.toString().includes(searchQuery) ||
                invoice?.currency?.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                invoice?.status?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    });

    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleDropdown = (id) => {
        setDropdownOpen(dropdownOpen === id ? null : id);
    };

    const toggleDisplayModal = () => {
        setDisplayModalOpen(!displayModalOpen);
    };

    const handleDisplayClick = (invoice) => {
        setSelectedInvoice(invoice);
        toggleDisplayModal();
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const toggleDeleteModal = () => {
        setDeleteModalOpen(!deleteModalOpen);
    };

    const toggleEditModal = () => {
        setEditModalOpen(!editModalOpen);
    };

    const handleEditClick = (invoice) => {
        setSelectedInvoice(invoice);
        setInvoiceToEdit(invoice);
        toggleEditModal();
    };
    const togglePaymentModal = () => {
        setPaymentModalOpen(!paymentModalOpen);
    };

    const handleEnregistrerPaymentClick = (invoice) => {
        setInvoiceToPay(invoice);
        togglePaymentModal();
    };
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Brouillon':
                return 'light';
            case 'Envoyé':
                return 'info';
            case 'Annulé':
                return 'warning';
            case 'En attente':
                return 'warning';
            case 'Accepté':
                return 'success';
            case 'Refusé':
                return 'danger';
            default:
                return 'light';
        }
    };
    const getCurrencySymbolById = (id, price) => {
        const currency = currencies.find(currency => currency._id === id);

        if (!currency) {
            return 'Devise non trouvée';
        }

        if (currency.symbolPosition === "after") {
            return price + currency.symbol;
        } else if (currency.symbolPosition === "before") {
            return currency.symbol + price;
        } else {
            return currency.symbol;
        }
    };
    
    const getPaymentStatusStyle = (status) => {
        switch (status) {
            case 'Payé':
                return 'success';
            case 'impayé':
                return 'danger';
            case 'Partiellement payé':
                return 'info';
            case 'Retard':
                return 'warning';
            default:
                return 'light';
        }
    };
    return (
        <>
            <ToastContainer />
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">Liste des factures reçus</h3>
                                <div className="d-flex">
                                    <Input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="mr-3"
                                    />
                                    <Button color="primary" onClick={toggleModal}>Ajouter facture</Button>
                                </div>
                            </CardHeader>
                            <div className="table-wrapper">
                                <Table className="align-items-center table-flush" >
                                    <thead className="thead-light">
                                        <tr>
                                        <th scope="col">Numéro de facture</th>
                                            <th scope="col">Client</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Total</th>
                                                {/* <th scope="col">Payé</th> */}
                                            <th scope="col">Status</th>
                                            <th scope="col">paiement</th>



                                            

                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentInvoices.length > 0 ? (
                                            currentInvoices.map((invoice) => (
                                                <tr key={invoice._id}>
                                                    <td>{invoice.number}</td>
                                                    <td>{getClientNameById(invoice.client._id)}</td>
                                                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                                                    <td>
                                                        { invoice.total}
                                                    </td>
                                                    {/* <td> {invoice.currency ? getCurrencySymbolById(invoice.currency._id, invoice.paidAmount) : 'Devise non trouvée'}</td> */}



                                                    <td>
                                                        <Badge color={getStatusStyle(invoice.status)}>
                                                            {invoice.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge color={getPaymentStatusStyle(invoice.paymentStatus)}>
                                                            {invoice.paymentStatus}
                                                        </Badge>
                                                    </td>

                                                    <td>
                                                        <Dropdown isOpen={dropdownOpen === invoice._id} toggle={() => toggleDropdown(invoice._id)} >
                                                            <DropdownToggle tag="span" data-toggle="dropdown" style={{ cursor: 'pointer' }}>
                                                                <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '1rem' }} />
                                                            </DropdownToggle>
                                                            <DropdownMenu right style={{ marginTop: "-25px" }}>
                                                                <DropdownItem onClick={() => { handleDisplayClick(invoice) }}>
                                                                    <span className="d-flex align-items-center">
                                                                        <i className="fa-solid fa-eye" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                        Afficher
                                                                    </span>
                                                                </DropdownItem>
                                                                <DropdownItem onClick={() => handleEditClick(invoice)}>
                                                                    <span className="d-flex align-items-center">
                                                                        <i className="fa-solid fa-gear" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                        Modifier
                                                                    </span>
                                                                </DropdownItem>
                                                                <DropdownItem onClick={() => handleEnregistrerPaymentClick(invoice)}>
                                                                    <span className="d-flex align-items-center">
                                                                        <i className="fa-solid fa-dollar-sign" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                        Enregistrer paiement
                                                                    </span>
                                                                </DropdownItem>
                                                               
                                                                <DropdownItem divider />
                                                                <DropdownItem onClick={() => handleDeleteClick(invoice._id)}>
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
                                                <td colSpan="8">
                                                    <div style={{ textAlign: 'center' }}>
                                                        <i className="fa-solid fa-ban" style={{ display: 'block', marginBottom: '10px', fontSize: '50px', opacity: '0.5' }}></i>
                                                        Aucune facture  trouvée
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                            <CardFooter className="py-4">
                                <nav aria-label="...">
                                    <Pagination className="pagination justify-content-end mb-0">
                                        {[...Array(Math.ceil(filteredInvoices.length / invoicesPerPage)).keys()].map((pageNumber) => (
                                            <PaginationItem key={pageNumber + 1} active={currentPage === pageNumber + 1}>
                                                <PaginationLink onClick={() => paginate(pageNumber + 1)}>
                                                    {pageNumber + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                    </Pagination>
                                </nav>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
            <AddProformaInvoice
                isOpen={modalOpen}
                toggle={toggleModal}
                refreshInvoices={fetchInvoices}
                userId={currentUserId}
            />
            {displayModalOpen && (
                <DisplayProformaInvoicemodal
                    isOpen={displayModalOpen}
                    toggle={toggleDisplayModal}
                    proformaInvoice={selectedInvoice}
                    userId={currentUserId}
                    refreshInvoices={refreshInvoices}
                />
            )}
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                toggle={toggleDeleteModal}
                onConfirm={confirmDeleteInvoice}
            />
            {editModalOpen && (
                <EditProformaInvoiceModal
                    isOpen={editModalOpen}
                    toggle={toggleEditModal}
                    invoiceData={invoiceToEdit}
                    refreshInvoices={refreshInvoices}
                    userId={currentUserId}
                />
            )}
             {paymentModalOpen && (
                <PaymentModal
                    isOpen={paymentModalOpen}
                    toggle={togglePaymentModal}
                    invoice={invoiceToPay}
                    refreshInvoices={refreshInvoices}
                    clients={clients}
                    userId={currentUserId}



                />
            )} 
        </>
    );
};
export default ProformaInvoice;
