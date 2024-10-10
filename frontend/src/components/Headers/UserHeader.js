/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
import React, { useState, useEffect } from "react";

const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};
const UserHeader = () => {
  const [user, setUser] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);


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
  }, [])
  return (
    <>
    
    <div
  className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
  style={{
    minHeight: "600px",
    backgroundImage: `url(${previewImage})`, // Updated line
    backgroundSize: "cover",
    backgroundPosition: "center top",
  }}
>

        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Hello {user.name}</h1>
              <p className="text-white mt-0 mb-5">
                This is your profile page. You can see the progress you've made
                with your work and manage your projects or assigned tasks
              </p>
              <Button
                color="info"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                Edit profile
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
