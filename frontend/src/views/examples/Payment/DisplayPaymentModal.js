import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table, Badge } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import DetailModal from "./DetailModal";
import "./style.css"

const DisplayPaymentModal = ({ isOpen, toggle, invoice }) => {
    const [payments, setPayments] = useState([]);
    const [noPayments, setNoPayments] = useState(false);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/payments/invoice/${invoice._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data.length === 0) {
                    setNoPayments(true);
                } else {
                    setNoPayments(false);
                }

                setPayments(response.data);
            } catch (error) {
                if (error.response?.status === 404) {
                    setNoPayments(true);
                } else {
                    console.error("Error fetching payment history:", error);
                    toast.error("Impossible de récupérer l'historique des paiements");
                }
            }
        };

        if (invoice?._id) {
            fetchPayments();
        }
    }, [invoice]);

    const toggleDetailModal = () => {
        setDisplayModalOpen(!displayModalOpen);
    };

    const handleDisplayClick = (payment) => {
        setSelectedPayment(payment);
        toggleDetailModal();
    };

    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>
                Historique de paiement pour la facture # {invoice.number}
                </ModalHeader>
                <ModalBody>
                    {noPayments ? (
                        <div style={{ textAlign: 'center' }}>
                            <i className="fa-solid fa-ban" style={{ display: 'block', marginBottom: '10px', fontSize: '50px', opacity: '0.5' }}></i>
                            Aucun historique de paiement trouvé
                        </div>
                    ) : (
                        payments.length > 0 ? (
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Montant payé</th>
                                        <th>Mode de paiement</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(payment => (
                                        <tr key={payment._id}>
                                            <td>{payment.amountPaid} </td>
                                            <td>{payment.paymentMethod}</td>
                                            <td>{payment.paymentDate.split("T")[0]}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <i className="fa-solid fa-ban" style={{ display: 'block', marginBottom: '10px', fontSize: '50px', opacity: '0.5' }}></i>
                                Aucun historique de paiement trouvé                            </div>
                        )
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Fermer</Button>
                </ModalFooter>
            </Modal>

            {selectedPayment && (
                <DetailModal
                    isOpen={displayModalOpen}
                    toggle={toggleDetailModal}
                    payment={selectedPayment}
                    invoice={invoice}
                />
            )}
        </>
    );
};

export default DisplayPaymentModal;
