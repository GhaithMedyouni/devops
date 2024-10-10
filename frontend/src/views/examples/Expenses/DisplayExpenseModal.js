import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table
} from 'reactstrap';

const DisplayExpenseModal = ({ isOpen, toggle, expense, categories }) => {

  const getCategoryNameById = (id) => {
    const category = categories.find(category => category._id === id);
    return category ? category.name : 'Category Not Found';
  };

  const thStyle = {
    padding: '8px 12px',
    borderRadius: '10px',
    color: '#770737',
    backgroundColor: '#FFB6C1	',
    textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff',

  };
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
    >


      <ModalHeader toggle={toggle}>Expense Details</ModalHeader>
      <ModalBody>
        <Table responsive>
          <tbody>
            <tr>
              <th><span style={thStyle}>Name</span></th>
              <td>{expense.name}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Category</span></th>
              <td>{getCategoryNameById(expense.depenseCategory._id)}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Currency</span></th>
              <td>{expense.currency}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Price</span></th>
              <td>{expense.price}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Description</span></th>
              <td>{expense.description}</td>
            </tr>
            <tr>
              <th><span style={thStyle}>Reference</span></th>
              <td>{expense.reference}</td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>

    </Modal>
  );
};

export default DisplayExpenseModal;
