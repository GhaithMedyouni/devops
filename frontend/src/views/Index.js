import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown,faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Card, CardBody, Col, Container, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, CardTitle, Spinner, Button, Badge, CardHeader, Progress, Table, CardFooter, Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";

const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};

const Index = () => {
  const token = localStorage.getItem('token');
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;

  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [paidInvoices, setPaidInvoices] = useState([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [proformaInvoices, setProformaInvoices] = useState([]);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalProforma, setTotalProforma] = useState(0);
  const [loadingPaid, setLoadingPaid] = useState(false);
  const [loadingUnpaid, setLoadingUnpaid] = useState(false);
  const [loadingProforma, setLoadingProforma] = useState(false);
  const [payments, setPayments] = useState(false);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnPaid, setTotalUnPaid] = useState(0);


  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/client', {
        params: { createdBy: currentUserId }
      });
      setClients(response.data);
      console.log(response.data);
    } catch (err) {
      toast.error('Failed to fetch clients');
    }
  };
  const fetchCurrencies = async () => {
    try {
      const currencyResponse = await axios.get("http://localhost:5000/api/currency", {
        params: { createdBy: currentUserId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrencies(currencyResponse.data);



    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  // const fetchInvoices = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/invoices/${currentUserId}`, {
  //       params: {
  //         type: selectedType || undefined,
  //         status: selectedStatus || undefined,
  //       }
  //     });

  //     const invoicesData = response.data;
  //     setInvoices(invoicesData);

  //     const currentMonth = new Date().getMonth() + 1;
  //     const currentYear = new Date().getFullYear();

  //     const totalUnpaidAmount = invoicesData
  //       .filter(invoice => {
  //         const invoiceDate = new Date(invoice.date);
  //         return (
  //           invoice?.type === 'Standard' &&
  //           invoice?.paymentStatus === "impayé" &&
  //           invoice?.currency?._id === selectedCurrency?._id &&
  //           invoiceDate.getMonth() + 1 === currentMonth &&
  //           invoiceDate.getFullYear() === currentYear
  //         );
  //       })
  //       .reduce((total, invoice) => total + invoice.total, 0);
  //     setTotalUnpaid(totalUnpaidAmount);

  //     const totalPaidAmount = invoicesData
  //       .filter(invoice => {
  //         const invoiceDate = new Date(invoice.date);
  //         return (
  //           invoice?.type === 'Standard' &&
  //           invoice?.paymentStatus === "Payé" &&
  //           invoice?.currency?._id === selectedCurrency?._id &&
  //           invoiceDate.getMonth() + 1 === currentMonth &&
  //           invoiceDate.getFullYear() === currentYear
  //         );
  //       })
  //       .reduce((total, invoice) => total + invoice.total, 0);
  //     console.log(invoicesData)
  //     setTotalPaid(totalPaidAmount);

  //     const totalProformaAmount = invoicesData
  //       .filter(invoice => {
  //         const invoiceDate = new Date(invoice.date);
  //         return (
  //           invoice?.type === 'Proforma' &&
  //           invoice?.currency?._id === selectedCurrency?._id &&
  //           invoiceDate.getMonth() + 1 === currentMonth &&
  //           invoiceDate.getFullYear() === currentYear
  //         );
  //       })
  //       .reduce((total, invoice) => total + invoice.total, 0);

  //     setTotalProforma(totalProformaAmount);

  //   } catch (error) {
  //     console.error("Error fetching invoices:", error);
  //   }
  // };



  const filteredInvoices = invoices.filter((invoice) => {
    return (
      (invoice?.type === 'Standard' || invoice?.isConverted === true) && invoice?.paymentStatus === "Paid"
    );
  });






  const getCurrencyByInvoiceId = (id) => {
    const invoice = filteredInvoices.find(invoice => invoice._id === id);
    if (!invoice || !invoice.currency) {
      return null;
    }
    console.log(invoice.currency);
    return invoice.currency._id;
  };



  const filteredStandardInvoices = invoices.filter((invoice) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const invoiceDate = new Date(invoice.date);
    return (

      invoice?.type === 'Standard' && invoice?.currency?._id === selectedCurrency?._id
      && invoiceDate.getMonth() + 1 === currentMonth &&
      invoiceDate.getFullYear() === currentYear


    );
  });

  const filteredProformaInvoices = invoices.filter((invoice) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const invoiceDate = new Date(invoice.date);
    return (

      invoice?.type === 'Proforma' && invoice?.currency?._id === selectedCurrency?._id &&
      invoiceDate.getMonth() + 1 === currentMonth &&
      invoiceDate.getFullYear() === currentYear

    );
  });
  const filteredInvoicesByStatus = (status) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      return (
        invoice?.type === 'Standard' &&
        invoice?.status === status &&
        invoiceDate.getMonth() + 1 === currentMonth &&
        invoiceDate.getFullYear() === currentYear &&
        invoice?.currency?._id === selectedCurrency?._id
      );
    });
  };
  const ProformafilteredInvoicesByStatus = (status) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      return (
        invoice?.type === 'Proforma' &&
        invoice?.status === status &&
        invoiceDate.getMonth() + 1 === currentMonth &&
        invoiceDate.getFullYear() === currentYear &&
        invoice?.currency?._id === selectedCurrency?._id
      );
    });
  };
  const filteredProformaInvoicesByStatus = (status) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      return (
        invoice?.type === 'Proforma' &&
        invoice?.status === status &&
        invoiceDate.getMonth() + 1 === currentMonth &&
        invoiceDate.getFullYear() === currentYear &&
        invoice?.currency?._id === selectedCurrency?._id
      );
    });
  };
  const filteredInvoicesByPaymentStatus = (status) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      return (
        invoice?.type === 'Standard' &&
        invoice?.paymentStatus === status &&
        invoiceDate.getMonth() + 1 === currentMonth &&
        invoiceDate.getFullYear() === currentYear &&
        invoice?.currency?._id === selectedCurrency?._id
      );
    });
  };

  const filteredProformaInvoicesByPaymentStatus = (status) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      return (
        invoice?.type === 'Proforma' &&
        invoice?.paymentStatus === status &&
        invoiceDate.getMonth() + 1 === currentMonth &&
        invoiceDate.getFullYear() === currentYear &&
        invoice?.currency?._id === selectedCurrency?._id
      );
    });
  };
  const Proformastatuspercentage = (status) => {
    if (!selectedCurrency || filteredProformaInvoices.length === 0) {
      return 0;
    }

    const filteredInvoices = filteredProformaInvoicesByStatus(status);

    const percentage = (filteredInvoices.length / filteredProformaInvoices.length) * 100;

    return Math.round(percentage);
  };





  const Paymentstatuspercentage = (status) => {
    if (!selectedCurrency || filteredStandardInvoices.length === 0) {
      return 0;
    }

    const filteredInvoices = filteredInvoicesByPaymentStatus(status);

    const percentage = (filteredInvoices.length / filteredStandardInvoices.length) * 100;

    return Math.round(percentage);
  };

  const ProformaPaymentstatuspercentage = (status) => {
    if (!selectedCurrency || filteredProformaInvoices.length === 0) {
      return 0;
    }

    const filteredInvoices = filteredProformaInvoicesByPaymentStatus(status);

    const percentage = (filteredInvoices.length / filteredProformaInvoices.length) * 100;

    return Math.round(percentage);
  };

  const Draftstatuspercentage = (status) => {
    if (!selectedCurrency || filteredStandardInvoices.length === 0) {
      return 0;
    }

    const filteredInvoices = filteredInvoicesByStatus(status);

    const percentage = (filteredInvoices.length / filteredStandardInvoices.length) * 100;

    return Math.round(percentage);
  };

  const ProformaDraftstatuspercentage = (status) => {
    if (!selectedCurrency || filteredProformaInvoices.length === 0) {
      return 0;
    }

    const filteredInvoices = ProformafilteredInvoicesByStatus(status);

    const percentage = (filteredInvoices.length / filteredProformaInvoices.length) * 100;

    return Math.round(percentage);
  };



  const fetchPayment = async () => {
    try {
      const paymentResponse = await axios.get(`http://localhost:5000/api/payments/createdBy/${currentUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const paymentsThisMonth = paymentResponse.data.filter(payment => {

        const paymentDate = new Date(payment.paymentDate);
        return (
          paymentDate.getMonth() + 1 === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      });
      const paymentsByCurrency = paymentsThisMonth.reduce((acc, payment) => {
        const currencyId = selectedCurrency._id;
        const x = Draftstatuspercentage();
        console.log(x)
        if (!currencyId) {
          return acc;
        }

        const paymentAmount = payment.amountPaid;
        if (!acc[currencyId]) {
          acc[currencyId] = 0;
        }
        acc[currencyId] += paymentAmount;

        return acc;
      }, {});

      console.log('Payments by Currency:', paymentsByCurrency);
      setPayments(paymentsByCurrency);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const getClientNameById = (clientId) => {
    const client = clients.find(client => client._id === clientId);
    if (!client) return 'Client not found';

    if (client.type === 'Person' && client.person) {
      return (
        <>
          {client.person.prenom} <br /> {client.person.nom}
        </>
      );
    } else if (client.type === 'Company' && client.entreprise) {
      return client.entreprise.nom;
    } else {
      return 'Client type not recognized';
    }
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case 'Envoyé':
        return 'success';
      case 'Annulé':
        return 'danger';
      case 'Brouillon':
        return 'light';

      case 'Cancelled':
        return 'danger';
      default:
        return 'light';
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Unpaid':
        return 'danger';
      case 'Partially Paid':
        return 'info';
      case 'Retard':
        return 'warning';
      default:
        return 'light';
    }
  };


  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
  };

  const getCurrencySymbolById = (id, price) => {
    const numericPrice = Number(price);

    if (isNaN(numericPrice)) {
      return 'Invalid amount';
    }

    const currency = currencies.find(c => c._id === id);
    if (!currency) return numericPrice.toFixed(2);

    return `${currency.symbol} ${numericPrice.toFixed(2)}`;
  };

  const toggleCurrencyDropdown = () => setCurrencyDropdownOpen(!currencyDropdownOpen);

  useEffect(() => {
    fetchCurrencies();
    fetchInvoices();
    fetchClients();
    fetchPayment();
  }, [selectedCurrency, startDate, endDate]);


  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoices/${currentUserId}`);

      // Check total number of invoices fetched
      console.log(`Total Invoices: ${response.data.length}`);

      const filteredInvoices = response.data.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Check if the currency matches the selected currency
        const currencyMatches = invoice?.currency?._id === selectedCurrency?._id;

        // Check if both startDate and endDate are selected
        const dateInRange =
          (!startDate && !endDate) || // If no dates are selected, include all invoices
          (invoiceDate >= start && invoiceDate <= end); // Date range check

        // Return true if both currency and date conditions are met
        return currencyMatches && dateInRange;
      });

      // Sort invoices by date (newest first)
      const sortedInvoices = filteredInvoices.sort((a, b) => new Date(b.date) - new Date(a.date));

      setInvoices(sortedInvoices);
      setTotalPaid(calculateTotalPaid(sortedInvoices));
      setTotalUnPaid(calculateTotalUnPaid(sortedInvoices));
      console.log(`Filtered and Sorted Invoices: ${sortedInvoices.length}`); // Log the number of filtered invoices
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };
  const calculateTotalPaid = (invoices) => {
    return invoices
      .filter(invoice => invoice.type === "Standard")
      .reduce((sum, invoice) => sum + invoice.total, 0);
  };

  const calculateTotalUnPaid = (invoices) => {
    return invoices
      .filter(invoice => invoice.type === "Proforma")
      .reduce((sum, invoice) => sum + invoice.total, 0);
  };


  const filterinvoices = invoices.filter((invoice) => {
    const isPersonClient = invoice?.client?.type === 'Person'; // Check if the client type is 'Person'
    const isCompanyClient = invoice?.client?.type === 'Company'; // Check if the client type is 'Company'

    return (

      (
        (isPersonClient && invoice?.client?.person.prenom?.toLowerCase().startsWith(searchQuery.toLowerCase())) || // For Person type, check if name starts with search query
        (isPersonClient && invoice?.client?.person.nom?.toLowerCase().startsWith(searchQuery.toLowerCase())) || // For Person type, check if name starts with search query

        (isCompanyClient && invoice?.client?.name?.toLowerCase().startsWith(searchQuery.toLowerCase())) || // For Company type, check if name starts with search query
        invoice?.number?.toString().startsWith(searchQuery) // Check if invoice number starts with the search query
      )
    );
  });




  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filterinvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  // Determine the badge color and icon based on the difference
  const difference = (totalPaid - totalUnPaid).toFixed(3);
    
  let badgeColor, arrowIcon;

  if (difference > 0) {
      badgeColor = 'success';
      arrowIcon = faArrowUp;
  } else if (difference < 0) {
      badgeColor = 'danger';
      arrowIcon = faArrowDown;
  } else {
      badgeColor = 'warning'; // Warning for zero
      arrowIcon = faExclamationTriangle; // Warning icon
  }
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <Row className="mb-4">
            <Col lg="12" className="mb-4 d-flex justify-content-end">
              <Dropdown
                isOpen={currencyDropdownOpen}
                toggle={toggleCurrencyDropdown}
              >
                <DropdownToggle caret>
                  {selectedCurrency ? selectedCurrency.name : "Select Devise"}
                </DropdownToggle>
                <DropdownMenu>
                  {currencies.map(currency => (
                    <DropdownItem key={currency._id} onClick={() => handleCurrencySelect(currency)}>
                      {currency.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
          <div className="header-body">
            <Row>
              {/* Paid Invoices Card */}
              <Col lg="6" xl="4">

                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Factures Ventes
                        </CardTitle>
                        <Badge color="success" style={{ fontSize: "20px" }}>
                          {/* {selectedCurrency ? getCurrencySymbolById(selectedCurrency._id, totalPaid) : "0.00"} */}
                          {totalPaid.toFixed(3)}
                        </Badge>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fas fa-check-circle" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {/* Unpaid Invoices Card */}
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Factures Achats
                        </CardTitle>
                        <Badge color="danger" style={{ fontSize: "20px" }}>
                          {totalUnPaid.toFixed(3)}
                        </Badge>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-times-circle" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {/* Proforma Invoices Card */}
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Bénéfices
                        </CardTitle>
                        <Badge color={badgeColor} style={{ fontSize: "20px", display: "flex", alignItems: "center" }}>
                          <FontAwesomeIcon icon={arrowIcon} style={{ marginRight: "5px" }} />
                          {difference}
                        </Badge>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-file-invoice" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>

      </div>
      <Container className="mt--7" fluid>


        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Factures Ventes et Achats</h3>
                  </div>
                  <div className="d-flex align-items-center">
                    <Input
                      type="date"
                      placeholder="Date Début"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mr-3"
                    />
                    <Input
                      type="date"
                      placeholder="Date Fin"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mr-3"
                    />
                    <Input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="mr-3"
                    />
                    {/* <Link to="/admin/invoices">
                      <Button color="primary" size="sm">
                        See all
                      </Button>
                    </Link> */}
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Number</th>
                    <th scope="col">Client</th>
                    <th scope="col">Date</th>

                    <th scope="col">Total </th>
                    <th scope="col">Status</th>
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
                          {invoice.total}
                        </td>



                        <td>
                          <Badge color={invoice.type === 'Proforma' ? 'warning' : 'success'}>
                            {invoice.type === 'Proforma' ? 'Achats' : 'Ventes'}
                          </Badge>
                        </td>



                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">
                        <div style={{ textAlign: 'center' }}>
                          <i className="fa-solid fa-ban" style={{ display: 'block', marginBottom: '10px', fontSize: '50px', opacity: '0.5' }}></i>
                          No invoices found
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0">
                    {[...Array(Math.ceil(invoices.length / invoicesPerPage)).keys()].map((pageNumber) => (
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
          </Col>

        </Row>
      </Container>
    </>
  );
};

export default Index;