import React from 'react';
import { Modal, ModalHeader, ModalBody, Button, Table, Badge } from 'reactstrap';

const DetailModal = ({ isOpen, toggle, payment, invoice }) => {
    console.log(invoice)
    console.log(payment)
    const getPaymentBadgeColor = (status) => {
        switch (status) {
            case 'Payé':
                return 'success';
            case 'Partiellement payé':
                return 'info';
            case 'impayé':
                return 'danger';
            case 'Retard':
                return 'warning';
            default:
                return 'light';
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>
                Payment Detail for Invoice #{invoice.number}/{invoice.year}
            </ModalHeader>
            <ModalBody>
                <div className="invoice-header">
                    <h4>Facture # {invoice.number}/{invoice.year}</h4>
                    <div className="status-badges">
                        <Badge color={getPaymentBadgeColor(invoice.paymentStatus)}>{invoice.paymentStatus}</Badge>
                    </div>
                    <div className="amounts-summary">

                        <div>Sous-total: ${invoice.subtotal}</div>
                        <div>Total: ${invoice.total}</div>
                    </div>
                </div>

                <div className="client-info">
                    <p><strong>Client:</strong> {invoice.client.person.nom} {invoice.client.person.prenom}</p>
                    <p><strong>Email:</strong> {invoice.client.person.email}</p>
                    <p><strong>Phone:</strong> {invoice.client.person.telephone}</p>
                </div>

                <div className="payment-summary">
                    <p><strong>Amount Payé:</strong> ${payment.amountPai}</p>
                    <p><strong>Total Payé:</strong> ${payment.totalPayé}</p>
                    <p><strong>Total Remaining:</strong> ${payment.totalRemaining}</p>
                </div>

                <Table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>${item.price}</td>
                                <td>{item.quantity}</td>
                                <td>${item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div className="action-buttons">
                    <Button color="secondary" onClick={toggle}>Close</Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default DetailModal;
