import React, { useState } from 'react';
import { Modal, ModalBody, Button, Badge, Table, Spinner } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./style.css";

const DisplayProformaInvoiceModal = ({ isOpen, toggle, proformaInvoice, refreshInvoices, userId }) => {
    const [loading, setLoading] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [invoice, setInvoice] = useState(proformaInvoice); 

    const getBadgeColor = (status) => {
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

    const handleDownloadPDF = async () => {
        console.log('Downloading PDF for proforma invoice:', invoice);

        try {
            const response = await axios.get(`http://localhost:5000/api/invoices/export-pdf/${invoice._id}/${invoice.createdBy}`, {
                responseType: 'blob',
            });

            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `proforma-invoice-${invoice.number}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to download PDF. Status:', response.status);
                toast.error('Failed to download PDF. Please try again.');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast.error('Error downloading PDF. Please try again.');
        }
    };

    const handleSendEmail = async () => {
        setLoading(true);
        console.log('Sending proforma invoice via email...');

        try {
            const response = await axios.get(`http://localhost:5000/api/invoices/export-pdf/send-email/${invoice._id}/${invoice.createdBy}`);
            if (response.status === 200) {
                setInvoice(prevInvoice => ({
                    ...prevInvoice,
                    status: 'Envoyé'
                }));

                toast.success('Proforma invoice sent via email successfully.');
                refreshInvoices(); 
            } else {
                toast.error('Failed to send the proforma invoice. Please try again.');
            }
        } catch (error) {
            console.error('Error sending proforma invoice via email:', error);
            toast.error('Error sending proforma invoice via email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const convertToInvoice = async () => {
        setIsConverting(true);

        try {
            const response = await axios.post(`http://localhost:5000/api/invoices/convert-to-facture/${invoice._id}`, null, {
                headers: {
                    Authorization: `Bearer ${userId}`
                }
            });

            if (response.status === 201) {
                toast.success('Proforma invoice converted to Facture successfully.');
                refreshInvoices(); 
                toggle();
            } else {
                toast.error('Failed to convert Proforma invoice. Please try again.');
            }
        } catch (error) {
            console.error('Error converting Proforma invoice:', error);
            toast.error('Error converting Proforma invoice. Please try again.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalBody>
                <div className="invoice-header">
                    <h4>Facture reçus # {invoice.number}/{invoice.year}</h4>
                    <div className="status-badges">
                        <Badge color={getBadgeColor(invoice.status)}>{invoice.status}</Badge>
                    </div>
                    <div className="amounts-summary">
                        <div>Status: {invoice.status}</div>
                        <div>Sous-total: {invoice.subtotal}</div>
                        <div>Total: {invoice.total}</div>
                    </div>
                </div>

                <div className="client-info">
                    <p><strong>Client:</strong> {invoice.client.person.nom} {invoice.client.person.prenom}</p>
                    <p><strong>Email:</strong> {invoice.client.person.email}</p>
                    <p><strong>Téléphone:</strong> {invoice.client.person.telephone}</p>
                </div>

                <Table>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Description</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.article}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div className="totals-section">
                    <p>Sous-total: {invoice.subtotal}</p>
                    <p>Total des taxes ({invoice.tax.value}%): {invoice.taxAmount}</p>
                    <p><strong>Total:</strong> {invoice.total}</p>
                </div>

                <div className="action-buttons">
                    <Button color="secondary" onClick={toggle}>Fermer</Button>
                    <Button color="info" onClick={handleDownloadPDF}>Télécharger PDF PDF</Button>
                    
                    

                    <Button color="primary" onClick={handleSendEmail} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner size="sm" /> Envoi...
                            </>
                        ) : (
                            'Envoyer par Email'
                        )}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default DisplayProformaInvoiceModal;
