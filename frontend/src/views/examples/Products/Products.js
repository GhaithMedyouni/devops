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
import AddProduct from "./AddProduct"
import ConfirmDeleteModal from "./ConfirmDeleteModal"
import DisplayProductModal from "./DisplayProductModal"
import EditProductModal from "./EditProductModal"
import "./style.css"

const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [buttonWidth, setButtonWidth] = useState('auto');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const [currencies, setCurrencies] = useState([]);


    const token = localStorage.getItem('token');
    const decodedToken = token ? decodeToken(token) : {};
    const currentUserId = decodedToken.AdminID;

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/product", { params: { createdBy: currentUserId } });


            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    

    const fetchCurrencies = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/currency", { params: { createdBy: currentUserId } });

            setCurrencies(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };


    useEffect(() => {
        fetchProducts();
        fetchCurrencies();
    }, []);

    const refreshProducts = () => {
        fetchProducts();
    };

   

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    const getCurrencyCodeById = (id) => {
        const currency = currencies.find(currency => currency._id === id);
        return currency ? currency.code : 'Devise non trouvée';
    };


    const getCurrencySymbolById = (id, price) => {
        const currency = currencies.find(currency => currency._id === id);
        if (!currency) return 'Devise non trouvée';
        if (currency.symbolPosition === "after") {
            return price.toFixed(2) + currency.symbol;
        } else if (currency.symbolPosition === "before") {
            return currency.symbol + price.toFixed(2);
        } else {
            return currency.symbol;
        }
    };

    const filteredProducts = products.filter((product) => {
        
        return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           
            product.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.price.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.reference.toLowerCase().includes(searchQuery.toLowerCase());
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

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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
        setProductToDelete(id);
        toggleDeleteModal();
    };

    const confirmDeleteProduct = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/product/${productToDelete}`);
            refreshProducts();
            toggleDeleteModal();
            toast.success('Service supprimé avec succès', {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const toggleEditModal = () => {
        setEditModalOpen(!editModalOpen);
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setProductToEdit(product);
        toggleEditModal();
    };

    const toggleDisplayModal = () => {
        setDisplayModalOpen(!displayModalOpen);
    };

    const handleDisplayClick = (product) => {
        setSelectedProduct(product);
        toggleDisplayModal();
    };

    return (
        <>
            <ToastContainer />
            <Header  />
            <Container className="mt--7 " fluid>
                <Row >
                    <div className="col " >
                        <Card className="shadow ">
                            <CardHeader className="border-0 d-flex justify-content-between align-items-center ">
                                <h3 className="mb-0">Listes des services</h3>
                                <div className="d-flex">
                                    <Input
                                        type="text"
                                        placeholder="Rechercher"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="mr-3"
                                    />
                                    <Button color="primary" style={{ width: buttonWidth }} onClick={toggleModal}>Ajouter un service</Button>
                                </div>
                            </CardHeader>
                            <div className="table-wrapper">
                                <Table className="align-items-center table-flush " >
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Nom</th>
                                            <th scope="col">Devise</th>
                                            <th scope="col">Prix</th>
                                            <th scope="col">Déscription</th>
                                            <th scope="col">Référence</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.length > 0 ? (
                                            currentProducts.map((product) => (
                                                <tr key={product._id}>
                                                    <td>{product.name}</td>
                                                   
                                                    <td>{getCurrencyCodeById(product.currency)}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.reference}</td>
                                                    <td>
                                                        <Dropdown isOpen={dropdownOpen === product._id} toggle={() => toggleDropdown(product._id)}>
                                                            <DropdownToggle tag="span" data-toggle="dropdown" style={{ cursor: 'pointer' }}>
                                                                <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '1rem' }} />
                                                            </DropdownToggle>
                                                            <DropdownMenu right style={{ marginTop: "-25px"}}>
                                                                <DropdownItem onClick={() => handleDisplayClick(product)}>
                                                                    <span className="d-flex align-items-center">
                                                                        <i className="fa-solid fa-eye" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                        Afficher
                                                                    </span>
                                                                </DropdownItem>
                                                                <DropdownItem onClick={() => handleEditClick(product)}>
                                                                    <span className="d-flex align-items-center">
                                                                        <i className="fa-solid fa-gear" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                                                        Modifier
                                                                    </span>
                                                                </DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem onClick={() => handleDeleteClick(product._id)}>
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
                            </div>
                            <CardFooter className="py-4">
                                <nav aria-label="...">
                                    <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                    >
                                        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
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
            <AddProduct
                isOpen={modalOpen}
                toggle={toggleModal}
                refreshProducts={refreshProducts}
                userId={currentUserId}
            />

            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                toggle={toggleDeleteModal}
                onConfirm={confirmDeleteProduct}
            />
            {displayModalOpen && (
                <DisplayProductModal
                    isOpen={displayModalOpen}
                    toggle={toggleDisplayModal}
                    product={selectedProduct}
                    categories={categories}
                    currencies={currencies}


                />)}
            {editModalOpen &&
                <EditProductModal
                    isOpen={editModalOpen}
                    toggle={toggleEditModal}
                    product={productToEdit}
                    refreshProducts={refreshProducts}
                    categories={categories}
                />}

        </>
    );
};

export default Products;
