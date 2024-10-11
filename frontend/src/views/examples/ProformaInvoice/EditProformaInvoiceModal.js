import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Row,
    Col,
    FormGroup,
    Label
} from 'reactstrap';
import { toast } from 'react-toastify';

const EditProformaInvoiceModal = ({ isOpen, toggle, invoiceData, refreshInvoices, userId }) => {
    const [invoice, setInvoice] = useState({
        client: '',
        number: 1,
        year: new Date().getFullYear(),
        currency: '',
        status: 'Brouillon',
        date: new Date().toISOString().substring(0, 10),
        note: '',
        items: [{ article: '', description: '', quantity: 1, price: 0, total: 0 }],
    });

    const [taxOptions, setTaxOptions] = useState([]);
    const [selectedTax, setSelectedTax] = useState('');
    const [taxAmount, setTaxAmount] = useState(0);
    const [invoiceTotal, setInvoiceTotal] = useState(0);
    const [clientOptions, setClientOptions] = useState([]);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [statusOptions] = useState(['Brouillon', 'Envoyé', 'Annulé', 'En attente', 'Accepté', 'Refusé']); 
    const [productOptions, setProductOptions] = useState([]);
    const [factureImage, setFactureImage] = useState(null);



    useEffect(() => {
        const fetchTaxes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/taxes', {
                    params: { createdBy: userId, isActive: true }
                });
                setTaxOptions(response.data.map(tax => ({
                    value: tax._id,
                    label: `${tax.name} - ${tax.value}%`
                })));
            } catch (error) {
                console.error("Error fetching taxes:", error);
            }
        };

        const fetchClients = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/client', {
                    params: { createdBy: userId }
                });
                setClientOptions(response.data.map(client => {
                    if (client.type === 'Person' && client.person) {
                        return {
                            value: client._id,
                            label: `${client.person.nom} ${client.person.prenom}`
                        };
                    } else if (client.type === 'Company' && client.entreprise) {
                        return {
                            value: client._id,
                            label: client.entreprise.nom
                        };
                    } else {
                        return {
                            value: client._id,
                            label: `Unknown Client`
                        };
                    }
                }));
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/currency', {
                    params: { createdBy: userId  }
                });
                setCurrencyOptions(response.data.map(currency => ({
                    value: currency._id,
                    label: `${currency.code} - ${currency.name}`
                })));
            } catch (error) {
                console.error("Error fetching currencies:", error);
            }
        };

        fetchTaxes();
        fetchClients();
        fetchProducts();
        fetchCurrencies();
    }, [userId]);

    useEffect(() => {
        if (invoiceData) {
            setInvoice(invoiceData);
            setSelectedTax(invoiceData.tax);
        }
    }, [invoiceData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvoice({ ...invoice, [name]: value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...invoice.items];
        newItems[index] = { ...newItems[index], [name]: value };
        newItems[index].total = newItems[index].quantity * newItems[index].price;
        setInvoice({ ...invoice, items: newItems });
    };

    const addItem = () => {
        setInvoice({ ...invoice, items: [...invoice.items, { article: '', description: '', quantity: 1, price: 0, total: 0 }] });
    };

    const removeItem = (index) => {
        const newItems = invoice.items.filter((_, i) => i !== index);
        setInvoice({ ...invoice, items: newItems });
    };

    const calculateSubtotal = () => {
        return invoice.items.reduce((acc, item) => acc + item.total, 0);
    };

    const handleTaxChange = (e) => {
        setSelectedTax(e.target.value);
    };

    useEffect(() => {
        const subtotal = calculateSubtotal();
        const selectedTaxOption = taxOptions.find(tax => tax.value === selectedTax);
        const calculatedTax = selectedTaxOption ? (subtotal * parseFloat(selectedTaxOption.label.split(' - ')[1])) / 100 : 0;
        setTaxAmount(calculatedTax);
        setInvoiceTotal(subtotal + calculatedTax);
    }, [invoice.items, selectedTax, taxOptions]);

    const handleSave = async () => {
        try {
            // Log the invoice ID being sent
            console.log(`Invoice ID being sent: ${invoice._id}`);
    
            const formData = new FormData();
    
            // Make sure to send only the client ObjectId
            formData.append('client', invoice.client._id); // Use client._id instead of the whole object
            formData.append('number', invoice.number);
            formData.append('year', invoice.year);
            formData.append('currency', invoice.currency._id);
            formData.append('status', invoice.status);
            formData.append('date', invoice.date);
            formData.append('note', invoice.note);
            formData.append('type', invoice.type);
    
            // Append items to FormData
            invoice.items.forEach((item, index) => {
                formData.append(`items[${index}][article]`, item.article);
                formData.append(`items[${index}][description]`, item.description);
                formData.append(`items[${index}][quantity]`, item.quantity);
                formData.append(`items[${index}][price]`, item.price);
                formData.append(`items[${index}][total]`, item.total);
            });
    
            formData.append('subtotal', calculateSubtotal());
    
            // Log selected tax
            console.log("Selected Tax:", selectedTax);
    
            // Append tax only if selectedTax is defined and has an _id
            if (selectedTax && selectedTax._id) {
                formData.append('tax', selectedTax._id);
            } else {
                console.warn("No valid tax ID found, skipping tax append.");
                // Handle what to do if tax is not set
            }
    
            formData.append('taxAmount', taxAmount);
            formData.append('total', invoiceTotal);
            formData.append('createdBy', userId);
    
            // Append the image file if it exists
            if (factureImage) {
                formData.append('factureImage', factureImage);
            } else {
                console.warn("No image file provided, skipping image append.");
            }
            
    
            // Determine payment status
            let paymentStatus = invoice.paidAmount >= invoice.total ? 'Payé' : 'impayé';
    
            // Send the invoice data including the image (if provided)
            await axios.put(`http://localhost:5000/api/invoices/invoices/${invoice._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            // Update payment status if necessary
            if (paymentStatus === 'impayé') {
                await axios.put(`http://localhost:5000/api/invoices/invoices/${invoice._id}`, {
                    paymentStatus: paymentStatus
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
    
            // Show success toast
            toast.success('Facture mise à jour avec succès', {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
    
            refreshInvoices();
            toggle();
        } catch (error) {
            console.error("Error updating invoice:", error);
    
            if (error.response && error.response.status === 400) {
                toast.error('Le numéro de facture existe déjà. Veuillez utiliser un numéro unique.', {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error('Erreur lors de la mise à jour de la facture. Veuillez réessayer plus tard.', {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };

    const handleProductChange = (index, selectedOption) => {
        const newItems = [...invoice.items];
        newItems[index] = {
            article: selectedOption.label, // Assuming you want the product name as the article
            description: selectedOption.description,
            quantity: 1, // Default quantity
            price: selectedOption.price,
            total: selectedOption.price // Set total based on price initially
        };
        setInvoice({ ...invoice, items: newItems });
    };
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/product', {
                params: { createdBy: userId } // Adjust according to your API
            });
            setProductOptions(response.data.map(product => ({
                value: product._id,
                label: product.name, // Adjust to the property you want to show
                price: product.price, // Assuming price is a property
                description: product.description // Assuming description is a property
            })));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };


    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>Modifier facture</ModalHeader>
            <ModalBody>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="client">Client</Label>
                            <Input
                                type="select"
                                name="client"
                                id="client"
                                value={invoice.client}
                                onChange={handleInputChange}
                            >
                                <option value="">{invoice.client.type === 'Person'
                                    ? `${invoice.client.person.prenom} ${invoice.client.person.nom} `
                                    : `${invoice.client.entreprise}`}</option>
                                {clientOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="number">Number</Label>
                            <Input
                                type="number"
                                name="number"
                                id="number"
                                value={invoice.number}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="year">Year</Label>
                            <Input
                                type="number"
                                name="year"
                                id="year"
                                value={invoice.year}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="date">Date</Label>
                            <Input
                                type="date"
                                name="date"
                                id="date"
                                value={invoice.date}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="status">Status</Label>
                            <Input
                                type="select"
                                name="status"
                                id="status"
                                value={invoice.status}
                                onChange={handleInputChange}
                            >
                                <option value="Brouillon">Brouillon</option>
                                <option value="Envoyé">Envoyé</option>
                                <option value="Annulé">Annulé</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="currency">Devise</Label>
                            <Input
                                type="select"
                                name="currency"
                                id="currency"
                                value={invoice.currency}
                                onChange={handleInputChange}
                            >
                                <option value="">{invoice.currency.code} - {invoice.currency.name}</option>
                                {currencyOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                   
                </Row>
                <FormGroup>
                    <Label for="note">Note</Label>
                    <Input
                        type="textarea"
                        name="note"
                        id="note"
                        value={invoice.note}
                        onChange={handleInputChange}
                    />
                </FormGroup>
                <h5>Services</h5>
                {invoice.items.map((item, index) => (
                    <Row form key={index} className="align-items-center">
                        <Col md={5}>
                            <FormGroup>
                                <Label for={`product-${index}`}>Service</Label>
                                <Input
                                    type="select"
                                    name={`product-${index}`}
                                    id={`product-${index}`}
                                    onChange={(e) => handleProductChange(index, productOptions.find(option => option.value === e.target.value))}
                                >
                                    <option value="">{invoice.items[index].article}</option>
                                    {productOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for={`quantity-${index}`}>Quantité</Label>
                                <Input
                                    type="number"
                                    name={`quantity-${index}`}
                                    id={`quantity-${index}`}
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const newItems = [...invoice.items];
                                        newItems[index].quantity = e.target.value;
                                        newItems[index].total = newItems[index].quantity * newItems[index].price;
                                        setInvoice({ ...invoice, items: newItems });
                                    }}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={2}>
                            <FormGroup>
                                <Label for={`total-${index}`}>Total</Label>
                                <Input
                                    type="text"
                                    name={`total-${index}`}
                                    id={`total-${index}`}
                                    value={item.total}
                                    readOnly
                                />
                            </FormGroup>
                        </Col>
                        <Col md={2}>
                            <Button color="danger" onClick={() => removeItem(index)}>Supprimer</Button>
                        </Col>
                    </Row>
                ))}
                <Button color="primary" onClick={addItem}>Ajouter</Button>
                <h5 className="mt-3"></h5>
                <hr />
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="invoiceImage">Upload Invoice Image</Label>
                            <Input
                                type="file"
                                id="invoiceImage"
                                onChange={(e) => setFactureImage(e.target.files[0])} // Store the selected file
                                accept="image/jpeg,image/png,image/jpg"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form className="mt-3">
                    <Col md={6}>
                        <FormGroup>
                            <Label for="tax">Tax</Label>
                            <Input
                                type="select"
                                name="tax"
                                id="tax"
                                value={selectedTax}
                                onChange={handleTaxChange}
                            >
                                <option>{selectedTax.value}%</option>
                                {taxOptions.map((tax) => (
                                    <option key={tax.value} value={tax.value}>
                                        {tax.label}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <div>Subtotal: ${calculateSubtotal().toFixed(2)}</div>
                        <div>Tax: ${taxAmount.toFixed(2)}</div>
                        <div>Total: ${invoiceTotal.toFixed(2)}</div>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Annuler</Button>
                <Button color="primary" onClick={handleSave}>Modifier</Button>
            </ModalFooter>
        </Modal>
    );
};

export default EditProformaInvoiceModal;
