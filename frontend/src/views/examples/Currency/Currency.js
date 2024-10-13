import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardHeader,
    CardFooter,
    Input,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Container,
    Row,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
} from "reactstrap";
import Header from "components/Headers/ElementHeader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import Switch from 'react-switch';
import AddCurrency from "./AddCurrency";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import DisplayCurrencyModal from "./DisplayCurrencyModal";
import EditCurrencyModal from "./EditCurrencyModal";

const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
};

const Currencies = () => {
    const [currencies, setCurrencies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currenciesPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [buttonWidth, setButtonWidth] = useState('auto');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currencyToDelete, setCurrencyToDelete] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currencyToEdit, setCurrencyToEdit] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    

    const token = localStorage.getItem('token');
    const decodedToken = token ? decodeToken(token) : {};
    const currentUserId = decodedToken.AdminID;

    const fetchCurrencies = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/currency", {
                params: { createdBy: currentUserId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrencies(response.data);
        } catch (error) {
            console.error("Error fetching currencies:", error);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, [currentUserId, token]);

    const refreshCurrencies = () => {
        fetchCurrencies();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCurrencies = currencies.filter((currency) => {
        return currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.symbolPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.decimalSeparator.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.thousandSeparator.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.zeroFormat.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.precision.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

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

    const indexOfLastCurrency = currentPage * currenciesPerPage;
    const indexOfFirstCurrency = indexOfLastCurrency - currenciesPerPage;
    const currentCurrencies = filteredCurrencies.slice(indexOfFirstCurrency, indexOfLastCurrency);

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
        setCurrencyToDelete(id);
        toggleDeleteModal();
    };

    const confirmDeleteCurrency = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/currency/${currencyToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            refreshCurrencies();
            toggleDeleteModal();
            toast.success('Devise supprimée avec succès', {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error deleting currency:", error);
        }
    };

    const toggleEditModal = () => {
        setEditModalOpen(!editModalOpen);
    };

    const handleEditClick = (currency) => {
        setSelectedCurrency(currency);
        setCurrencyToEdit(currency);
        toggleEditModal();
    };

    const toggleDisplayModal = () => {
        setDisplayModalOpen(!displayModalOpen);
    };

    const handleDisplayClick = (currency) => {
        setSelectedCurrency(currency);
        toggleDisplayModal();
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
                                <h3 className="mb-0">Listes des devises</h3>
                                <div className="d-flex">
                                    <Input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="mr-3"
                                    />
                                    <Button color="primary" style={{ width: buttonWidth }} onClick={toggleModal}>Ajouter une devise</Button>
                                </div>
                            </CardHeader>
                            <div className="table-wrapper">
                                <Table className="align-items-center table-flush" >
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Nom</th>
                                            <th scope="col">Code</th>
                                            <th scope="col">Symbole</th>
                                           

                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCurrencies.length > 0 ? (
                                            currentCurrencies.map((currency) => (
                                                <tr key={currency._id}>
                                                    <td>{currency.name}</td>
                                                    <td>{currency.code}</td>
                                                    <td>{currency.symbol}</td>
                                                    
                                                    <td>
                                                        <Dropdown isOpen={dropdownOpen === currency._id} toggle={() => toggleDropdown(currency._id)}>
                                                            <DropdownToggle tag="span" data-toggle="dropdown" style={{ cursor: 'pointer' }}>
                                                                <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '1rem' }} />
                                                            </DropdownToggle>
                                                            <DropdownMenu right style={{ marginTop: "-25px" }}>
                                                                <DropdownItem onClick={() => handleDisplayClick(currency)}>
                                                                    <span className="d-flex align-items-center">
                                                                        <i className="fa-solid fa-eye" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                        Afficher
                                                                    </span>
                                                                </DropdownItem>
                                                                <DropdownItem onClick={() => handleEditClick(currency)}>
                                                                    <span className="d-flex align-items-center">
                                                                        <i className="fa-solid fa-gear" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                        Modifer
                                                                    </span>
                                                                </DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem onClick={() => handleDeleteClick(currency._id)}>
                                                                    <span className="d-flex align-items-center">
                                                                        <i className="fa-solid fa-trash text-danger" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                        <span className="text-danger">Supprimer</span>
                                                                    </span>
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9">
                                                    <div style={{ textAlign: 'center' }}>
                                                        <i className="fa-solid fa-ban" style={{ display: 'block', marginBottom: '10px', fontSize: '50px', opacity: '0.5' }}></i>
                                                        <span className="text-danger">Aucun enregistrement correspondant n'a été trouvé</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                            <CardFooter className="py-4">
                                <nav aria-label="...">
                                    <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end mb-0">
                                        {Array.from({ length: Math.ceil(filteredCurrencies.length / currenciesPerPage) }).map((_, index) => (
                                            <PaginationItem key={index} active={index + 1 === currentPage}>
                                                <PaginationLink onClick={() => paginate(index + 1)}>{index + 1}</PaginationLink>
                                            </PaginationItem>
                                        ))}
                                    </Pagination>
                                </nav>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                toggle={toggleDeleteModal}
                onConfirm={confirmDeleteCurrency}
            />
            {displayModalOpen && (
                <DisplayCurrencyModal
                    isOpen={displayModalOpen}
                    toggle={toggleDisplayModal}
                    currency={selectedCurrency}
                />
            )}
            <AddCurrency
                isOpen={modalOpen}
                toggle={toggleModal}
                refreshCurrencies={refreshCurrencies}
                userId={currentUserId}
            />
            {editModalOpen && (
                <EditCurrencyModal
                    isOpen={editModalOpen}
                    toggle={toggleEditModal}
                    currency={currencyToEdit}
                    refreshCurrencies={refreshCurrencies}
                />
            )}
        </>
    );
};

export default Currencies;
