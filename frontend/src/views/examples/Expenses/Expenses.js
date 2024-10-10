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
import AddExpense from "./AddExpense";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import DisplayExpenseModal from "./DisplayExpenseModal";
import EditExpenseModal from "./EditExpenseModal";

const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonWidth, setButtonWidth] = useState('auto');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [displayModalOpen, setDisplayModalOpen] = useState(false);

  const token = localStorage.getItem('token');
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/depense", {
        params: { createdBy: currentUserId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/depense-categories", { params: { createdBy: currentUserId } });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [currentUserId, token]);

  const refreshExpenses = () => {
    fetchExpenses();
  };

  const refreshCategories = () => {
    fetchCategories();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getCategoryNameById = (id) => {
    const category = categories.find(category => category._id === id);
    return category ? category.name : 'Category Not Found';
  };

  const filteredExpenses = expenses.filter((expense) => {
    const categoryName = expense.depenseCategory ? getCategoryNameById(expense.depenseCategory._id) : 'Category Not Found';
    return expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.price.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.reference.toLowerCase().includes(searchQuery.toLowerCase());
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

  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

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
    setExpenseToDelete(id);
    toggleDeleteModal();
  };

  const confirmDeleteExpense = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/depense/${expenseToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshExpenses();
      toggleDeleteModal();
      toast.success('Expense deleted successfully', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setExpenseToEdit(expense);
    toggleEditModal();
  };

  const toggleDisplayModal = () => {
    setDisplayModalOpen(!displayModalOpen);
  };

  const handleDisplayClick = (expense) => {
    setSelectedExpense(expense);
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
                <h3 className="mb-0">Expenses List</h3>
                <div className="d-flex">
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mr-3"
                  />
                  <Button color="primary" style={{ width: buttonWidth }} onClick={toggleModal}>Add New Expense</Button>
                </div>
              </CardHeader>
              <div className="table-wrapper">
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Category</th>
                      <th scope="col">Currency</th>
                      <th scope="col">Price</th>
                      <th scope="col">Description</th>
                      <th scope="col">Reference</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExpenses.length > 0 ? (
                      currentExpenses.map((expense) => (
                        <tr key={expense._id}>
                          <td>{expense.name}</td>
                          <td>
                            {expense.depenseCategory ? (
                              getCategoryNameById(expense.depenseCategory._id)
                            ) : (
                              'Category Not Found'
                            )}
                          </td>
                          <td>{expense.currency}</td>
                          <td>{expense.price}</td>
                          <td>{expense.description}</td>
                          <td>{expense.reference}</td>
                          <td>
                            <Dropdown isOpen={dropdownOpen === expense._id} toggle={() => toggleDropdown(expense._id)}>
                              <DropdownToggle tag="span" data-toggle="dropdown" style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '1rem' }} />
                              </DropdownToggle>
                              <DropdownMenu right style={{ marginTop: "-25px" }}>
                                <DropdownItem onClick={() => handleDisplayClick(expense)}>
                                  <span className="d-flex align-items-center">
                                    <i className="fa-solid fa-eye" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                    Display
                                  </span>
                                </DropdownItem>
                                <DropdownItem onClick={() => handleEditClick(expense)}>
                                  <span className="d-flex align-items-center">
                                    <i className="fa-solid fa-gear" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                    Edit
                                  </span>
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => handleDeleteClick(expense._id)}>
                                  <span className="d-flex align-items-center">
                                    <i className="fa-solid fa-trash text-danger" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                    <span className="text-danger">Delete</span>
                                  </span>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">
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
                    {Array.from({ length: Math.ceil(filteredExpenses.length / expensesPerPage) }).map((_, index) => (
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
      <AddExpense
        isOpen={modalOpen}
        toggle={toggleModal}
        refreshExpenses={refreshExpenses}
        userId={currentUserId}
      />
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        toggle={toggleDeleteModal}
        onConfirm={confirmDeleteExpense}
      />
      {displayModalOpen && (
        <DisplayExpenseModal
          isOpen={displayModalOpen}
          toggle={toggleDisplayModal}
          expense={selectedExpense}
          categories={categories}
        />
      )}
      
      {editModalOpen && (
        <EditExpenseModal
          isOpen={editModalOpen}
          toggle={toggleEditModal}
          expense={expenseToEdit}
          refreshExpenses={refreshExpenses}
          refreshCategories={refreshCategories}
          categories={categories}
        />
      )}
    </>
  );
};

export default Expenses;
