import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Profile = () => {
  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});
  const [avatarColor, setAvatarColor] = useState(getRandomColor());
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      setUser(decodedToken);
      const storedImage = localStorage.getItem(`profileImage_${decodedToken.AdminID}`);
      if (storedImage) {
        setPreviewImage(storedImage);
      } else if (decodedToken.photo) {
        const imageUrl = decodedToken.photo.startsWith('http')
          ? decodedToken.photo
          : `http://localhost:5000/${decodedToken.photo}`;
        setPreviewImage(imageUrl);
        localStorage.setItem(`profileImage_${decodedToken.AdminID}`, imageUrl);
      }
    }
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [currentUserId]);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/companysetting/getByCreatedBy/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setCompany(data);
      // setName(data.name);
      // setAddress(data.address);
      // setState(data.state);
      // setCountry(options.find(opt => opt.value === data.country));
      // setEmail(data.email);
      // setPhone(data.phone);
      // setWebsite(data.website);
      // setTaxNumber(data.taxNumber);
      // setVatNumber(data.vatNumber);
      // setRegistrationNumber(data.registrationNumber);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };
  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSubmit = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('photo', selectedImage);

    try {
      const token = localStorage.getItem('token');
      const { AdminID } = decodeToken(token);
      const response = await axios.post(
        `http://localhost:5000/api/update/${AdminID}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const updatedUser = response.data;
      setUser(updatedUser);
      if (updatedUser.photo) {
        const imageUrl = updatedUser.photo.startsWith('http')
          ? updatedUser.photo
          : `http://localhost:5000/${updatedUser.photo}`;
        setPreviewImage(imageUrl);
        localStorage.setItem(`profileImage_${AdminID}`, imageUrl);
      }
      setSelectedImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image.');
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const { AdminID } = decodeToken(token);
      const response = await axios.post(
        `http://localhost:5000/api/update/${AdminID}/`,
        { password: newPassword },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('Password updated successfully. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(response.data.message || 'Error updating password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error updating password.');
    }
  };

  return (
    <>
      <UserHeader />
      <ToastContainer />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3" responsive>
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile"
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: avatarColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '40px',
                            color: 'white',
                            marginTop: "20px"
                          }}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                {selectedImage && (
                  <div className="text-center mt-2">
                    <Button
                      color="primary"
                      onClick={handleImageSubmit}
                      size="sm"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">

                    <Button
                      className="mr-4"
                      color="info"
                      onClick={() => document.getElementById('imageInput').click()}
                      size="sm"
                    >
                      Change profile image
                    </Button>
                    <input
                      type="file"
                      id="imageInput"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <Button
                      className="float-right"
                      color="default"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Message
                    </Button>
                  </div>
                  <div className="card-profile-stats mt-md-5 text-center">
                    <h4 style={{ color: '#343a40', fontSize: '1.5rem', fontWeight: '600',textAlign:'cent' }}>Your Company</h4>

                    <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="mb-3" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Button color="primary" size="sm" style={{ backgroundColor: '#007bff', borderColor: '#007bff', color: '#ffffff', fontWeight: '500' }}>
                            Name
                          </Button>
                          <h3 style={{ marginLeft: '10px', color: '#495057' }}>{company.name}</h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Button color="primary" size="sm" style={{ backgroundColor: '#007bff', borderColor: '#007bff', color: '#ffffff', fontWeight: '500' }}>
                            Phone
                          </Button>
                          <h3 style={{ marginLeft: '10px', color: '#495057' }}>{company.phone}</h3>
                        </div>
                      </div>
                      <div className="mb-3" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Button color="primary" size="sm" style={{ backgroundColor: '#007bff', borderColor: '#007bff', color: '#ffffff', fontWeight: '500' }}>
                            Email
                          </Button>
                          <h3 style={{ marginLeft: '10px', color: '#495057' }}>{company.email}</h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Button color="primary" size="sm" style={{ backgroundColor: '#007bff', borderColor: '#007bff', color: '#ffffff', fontWeight: '500' }}>
                            Country
                          </Button>
                          <h5 style={{ marginLeft: '10px', color: '#495057' }}>{company.country}</h5>
                        </div>
                      </div>
                    </div>
                  </div>



                </Row>
                <div className="text-center">
                  <h3>
                    {user.name || 'User'}
                    <span className="font-weight-light">, {user.surname || 'N/A'}</span>
                  </h3>

                  <div className="h5 mt-4">
                    <span className="font-weight-light">Role</span><br />
                    <h3>{user.role || 'N/A'}</h3>
                  </div>



                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPasswordForm(!showPasswordForm);
                      }}
                      size="sm"
                    >
                      Change password
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Username"
                            type="text"
                            value={user.name || ''}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="jesse@example.com"
                            type="email"
                            value={user.email || ''}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            placeholder="First name"
                            type="text"
                            value={user.name || ''}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-last-name"
                            placeholder="Last name"
                            type="text"
                            value={user.surname || ''}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  {showPasswordForm && (
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-new-password"
                            >
                              New Password
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-new-password"
                              placeholder="New Password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-confirm-password"
                            >
                              Confirm Password
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-confirm-password"
                              placeholder="Confirm Password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="text-center">
                        <Button
                          color="primary"
                          onClick={handlePasswordSubmit}
                          size="sm"
                        >
                          Save Password
                        </Button>
                      </div>
                    </div>
                  )}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
