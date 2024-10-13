import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";



// Function to decode JWT token
const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};

// Logout function
const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/auth/login";
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
const AdminNavbar = (props) => {
  const token = localStorage.getItem("token");
  const user = token ? decodeToken(token) : null;
  const [previewImage, setPreviewImage] = useState(null);
  const [avatarColor, setAvatarColor] = useState(getRandomColor());



  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
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

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {user ? user.name : "User"}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
               
                <DropdownItem href="#pablo" onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Se déconnecter</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
