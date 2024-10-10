import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("Login successful:", response.data);
      navigate("/admin/index");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Admin not found or incorrect credentials.");
        } else if (error.response.status === 401) {
          setError("Incorrect email or password, or email not confirmed.");
        } else if (error.response.status === 500) {
          setError("Internal server error. Please try again later.");
        } else {
          setError("Login failed. Please try again.");
        }
      } else if (error.request) {
        setError("No response from the server. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  const googleAuth = () => {
    window.open(`http://localhost:5000/auth/google`, "_self");
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          
          <CardBody className="px-lg-5 py-lg-5">
            
            <Form role="form" onSubmit={handleSubmit}>
              {error && (
                <div className="text-center text-danger mb-4">
                  <small>{error}</small>
                </div>
              )}
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
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
                    autoComplete="new-email"
                    required
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
                    autoComplete="new-password"
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Se connecter
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">

          <Col xs="6">
            <Link className="text-light" to="/password-reset/forgot-password">
              <small>mot de passe oublié?</small>
            </Link>
          </Col>

          <Col className="text-right" xs="6">
            <Link className="text-light" to="/auth/register">
              <small>Créer un compte</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
