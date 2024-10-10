const express = require('express');
const router = express.Router();
const companyController = require('../controllers/EntrepriseSetting');

// Create or Update a company
router.post('/createOrUpdate', companyController.createOrUpdateCompany);
router.get('/getByCreatedBy/:createdBy', companyController.getCompanyByCreatedBy);
router.post('/uploadOrUpdateLogo/:createdBy', companyController.uploadCompanyLogo);
module.exports = router;
