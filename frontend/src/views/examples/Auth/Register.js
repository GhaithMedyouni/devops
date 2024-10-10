import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Col,
  CardHeader,
} from "reactstrap";

const Register = () => {
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const MIN_PASSWORD_LENGTH = 6;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "password") {
      if (value.length < MIN_PASSWORD_LENGTH) {
        setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      } else {
        setPasswordError("");
      }
    }

    if (name === "password") {
      const result = zxcvbn(value);
      const score = result.score;
      let strength = "";

      if (score === 0) {
        strength = "weak";
      } else if (score === 1 || score === 2) {
        strength = "medium";
      } else if (score === 3 || score === 4) {
        strength = "strong";
      }

      setPasswordStrength(strength);
    }
  };
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "text-danger";
      case "medium":
        return "text-warning";
      case "strong":
        return "text-success";
      default:
        return "";
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }


    // if (passwordStrength === "weak") {
    //   setError("Password is too weak. Please choose a stronger password.");
    //   return;
    // }

    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      navigate('/auth/login');
      console.log("Registration successful:", response.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {

        setError("No response from the server. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };



  return (
    <Col lg="6" md="8">
      <Card className="bg-secondary shadow border-0">
        
        <CardBody className="px-lg-5 py-lg-5">
          
          <Form role="form" onSubmit={handleSubmit}>
            {error && (
              <div className="text-center text-danger mb-4">
                <small>{error}</small>
              </div>
            )}
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}

                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Surname"
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}

                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}

                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Mot de passe"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}

                />
              </InputGroup>
            </FormGroup>
            <div className="text-muted font-italic">
              <small>
              Force du mot de passe:{" "}
                <span className={`font-weight-700 ${getPasswordStrengthColor()}`}>
                  {passwordStrength.toUpperCase()}
                </span>
              </small>
            </div>
            
            <div className="text-center">
              <Button className="mt-4" color="primary" type="submit">
                Créer un compte
              </Button>
            </div>
          </Form>
        </CardBody>

      </Card>
      <Col className="text-center mt-4">
        <Link className="text-light" to="/auth/login">
          <small>Se connecter</small>
        </Link>
      </Col>
    </Col>
  );
};

export default Register;
