import React from 'react';
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Company from "views/examples/Companies/Company";
import Clients from "views/examples/Clients/Clients";
import Register from "views/examples/Auth/Register";
import Login from "views/examples/Auth/Login";
import Tables from "views/examples/Tables.js";
import Person from "views/examples/Persons/Persons";
import ForgotPassword from "views/examples/Auth/ForgotPassword";
import ProductCategory from "views/examples/ProductCategory/ProductCategory";
import Product from "views/examples/Products/Products";
import ExpenseCategory from "views/examples/ExpensesCategory/ExpensesCategory";
import Expenses from "views/examples/Expenses/Expenses";
import Currency from "views/examples/Currency/Currency";
import Taxes from "views/examples/Taxes/Taxes";
import Mycompany from "views/examples/Mycompany/Mycompany";
import Invoices from "views/examples/Invoices/Invoices";
import ProformaInvoice from "views/examples/ProformaInvoice/ProformaInvoice";
import Payment from "views/examples/Payment/Payment";
import Report from "views/examples/Report/Report";








const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};

const token = localStorage.getItem('token');
const decodedToken = token ? decodeToken(token) : {};
const currentUserId = decodedToken.AdminID;

const isAuthenticated = !!currentUserId; 
const routes = [
  {
    path: "/index",
    name: "Tableau de bord",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/persons",
    name: "Personnes",
    icon: "ni ni-circle-08 text-blue",
    component: <Person />,
    layout: "/admin",
  },
  {
    path: "/company",
    name: "Entreprises",
    icon: "ni ni-building text-orange",
    component: <Company />,
    layout: "/admin",
  },
  {
    path: "/clients",
    name: "Clients",
    icon: "ni ni-single-02 text-yellow",
    component: <Clients />,
    layout: "/admin",
  },


  {
    path: "/product",
    name: "Services",
    icon: "fa-solid fa-box text-green",
    component: <Product />,
    layout: "/admin",
  },


  {
    path: "/invoices",
    name: "Factures envoyées",
    icon: "fa-solid fa-file-invoice-dollar text-red",
    component: <Invoices />,
    layout: "/admin",

    
  },
  {
    path: "/proforma-invoice",
    name: "Factures reçus",
    icon: "fa-solid fa-file-invoice text-blue",
    component: <ProformaInvoice />,
    layout: "/admin",

    
  },

  {
    path: "/payment",
    name: "Paiements",
    icon: "fa-solid fa-credit-card text-yellow",
    component: <Payment />,
    layout: "/admin",

    
  },

  {
    path: "/currencies",
    name: "Devise",
    component: <Currency />,
    icon : "fa-solid fa-dollar-sign text-red",
    layout: "/admin",
  },
  {
    path: "/taxes",
    name: "Taxes",
    icon:"fa-solid fa-percent text-blue",
    component: <Taxes />,
    layout: "/admin",
  },
  {
    path: "/mycompany",
    name: "Ma entreprise",
    component: <Mycompany />,
    icon:"fa-solid fa-building text-green",
    layout: "/admin",
  },

  !isAuthenticated && {
    path: "/login",
    component: <Login />,
    layout: "/auth",
  },
  !isAuthenticated && {
    path: "/register",
    component: <Register />,
    layout: "/auth",
  },
  !isAuthenticated && {
    path: "/forgot-password",
    component: <ForgotPassword />,
    layout: "/password-reset",
  }
].filter(Boolean); 
export default routes;
