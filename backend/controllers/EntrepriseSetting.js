const Company = require('../models/coreModel/EntrepriseSetting');

// Create or Update a company based on the createdBy field
exports.createOrUpdateCompany = async (req, res) => {
  const { name, address, state, country, email, phone, website, taxNumber, vatNumber, registrationNumber, createdBy } = req.body;

  try {
    // Check if a company with this createdBy already exists
    let company = await Company.findOne({ createdBy });

    if (company) {
      // If company exists, update it
      company = await Company.findOneAndUpdate(
        { createdBy },
        { name, address, state, country, email, phone, website, taxNumber, vatNumber, registrationNumber },
        { new: true } // Return the updated document
      );

      res.status(200).json({ message: 'Company updated successfully', company });
    } else {
      // If company does not exist, create a new one
      const newCompany = new Company({
        name,
        address,
        state,
        country,
        email,
        phone,
        website,
        taxNumber,
        vatNumber,
        registrationNumber,
        createdBy,
      });

      const savedCompany = await newCompany.save();
      res.status(201).json({ message: 'Company created successfully', company: savedCompany });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing company information', error });
  }
};
exports.getCompanyByCreatedBy = async (req, res) => {
    const { createdBy } = req.params;
  
    try {
      // Find the company by the createdBy field
      const company = await Company.findOne({ createdBy });
  
      if (!company) {
        const defaultSettings = {
            message: 'No company settings found. Please configure your company settings.',
            defaultSettings: {
              name: '',
              address: '',
              state: 'new york',
              country: 'usa',
              email: 'exmple@exemple.com',
              phone: '+21611111111',
              website: 'www.expmle.com',
              taxNumber: '11111333333',
              vatNumber: '33333333333',
              registrationNumber: '3333333333',
              logo:""
            },
          };
        return res.status(404).json(defaultSettings);
      }
  
      res.status(200).json(company);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching company', error });
    }
  };
///////////////////////add logo
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/logos/'); // Directory to save the uploaded files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  // File filter to accept only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  };
  
  // Initialize Multer
  const upload = multer({
    storage: storage,
   // limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: fileFilter
  }).single('logo');
  
  // Upload logo for a company
  exports.uploadCompanyLogo = (req, res) => {
    const { createdBy } = req.params;
    const defaultData = {
        name: "treetronix",
        address: "25, Your Company Address",
        state: "New York",
        country: "United State",
        email: "youremail@example.com",
        phone: "+1 345234654",
        website: "www.example.com",
        taxNumber: "91231255234",
        vatNumber: "91231255234",
        registrationNumber: "00001231421",
        createdBy: createdBy,
      };
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      try {
        // Find the company by cretedby
        let company = await Company.findOne({ createdBy });
        if (company) {
            company = await Company.findOneAndUpdate(
                { createdBy },
                { logo:req.file.path,},
                { new: true } // Return the updated document
              );
              res.status(200).json({ message: 'Logo updated successfully', company });

        }
        else {
            // If company does not exist, create a new one
            const newCompany = new Company({
              ...defaultData,
              logo:req.file.path,
            });
            const savedCompany = await newCompany.save();
            res.status(201).json({ message: 'Company created successfully', savedCompany });
      }} catch (error) {
        res.status(500).json({ message: 'Error uploading logo', error });
      }
    });
  };