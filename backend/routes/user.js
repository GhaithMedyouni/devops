const express = require('express');
const router = express.Router();
const user = require('../models/user')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()
const nodemailer = require('nodemailer');

//ajouter user
router.post('/register',async (req,res)=>{

    
    try{  
        const existingUser = await user.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
      const newuser = new user({
            firstname : req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            telephone:req.body.telephone,
            status:false,
            facture:[],
            password:req.body.password
  
      })
      await newuser.save()

      const token = jwt.sign({ email: newuser.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
      const transporter = nodemailer.createTransport({
        host: process.env.HOST_MAILER,
        port: process.env.PORT_MAILER,
        secure: process.env.SECURE_MAILER === 'true', // Use environment variable to control secure flag
        auth: {
          user: process.env.USER_MAILER,
          pass: process.env.PASS_MAILER,
        },
        tls: {
          rejectUnauthorized: false, // Allow unauthorized certs (optional, should be used cautiously)
        },
      });

    const mailOptions = {
        from: process.env.USER_MAILER,
        to: req.body.email, // User's email address
        subject: 'Confirmation Email',
        text: 'Thank you for registering. Your account has been successfully created.',
        html: `<p>Thank you for registering. Please click <a href="${process.env.BASE_URL}user/confirm/${token}">here</a> to confirm your email address.</p>`

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            // Handle error
        } else {
            console.log('Email sent: ' + info.response);
            // Handle success
        }
    });
      res.status(201).json({ message: 'user added successfully', Article: newuser });
   }
   catch(error){
      res.status(400).json({ message: 'Failed to add user', error: error.message });
   }
      });
      ///confirm email in the email
      router.get('/confirm/:token', async (req, res) => {
        try {
            const token = req.params.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Update user's profile status to "true"
            await user.findOneAndUpdate({ email: decoded.email }, { status: true });
            // Redirect the user to a confirmation page or send a response indicating successful confirmation
            res.sendFile(__dirname+'/mail_confirm.html')
        } catch (error) {
            res.status(400).json({ message: 'Invalid or expired token', error: error.message });
        }
    });
  // Route for user login
  router.post('/login', async (req, res) => {
    console.log('herrre'+req.body.email)
     const { email, password } = req.body;
  
     try {
        const userData = await user.findOne({ email:req.body.email });
         // Check if email exists in database (replace this with your actual database query)
         if (userData.email !== email) {
             return res.status(401).json({ message: 'Incorrect email or password' });
         }
         if (userData.status === false) {
            return res.status(401).json({ message: 'this email not confirmed' });
        }
  
         // Check if password matches (replace this with bcrypt compare)
         const passwordMatch = await bcrypt.compare(password, userData.password);
         if (!passwordMatch) {
             return res.status(401).json({ message: 'Incorrect email or password' });
         }
  
         // Generate JWT
         const token = jwt.sign({ name: userData.name ,userId: userData.id, email: userData.email,role:userData.role},process.env.JWT_SECRET);
  
         // Send JWT to client
         res.status(200).json({ token });
     } catch (error) {
         console.error('Error during login:', error);
         res.status(500).json({ message: 'Internal server error' });
     }
  });
  // GET user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userdata = await user.findById(userId).populate('facture')
        .populate('article')
        .populate('depense');
        if (!userdata) {    
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(userdata);
        console.log(userdata.facture)
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/getall', async (req, res) => {
    try {
        const users = await user.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const userData = req.body; // Assuming the updated user data is sent in the request body

    try {
        // Find the user by ID and update its information
        const updatedUser = await user.findByIdAndUpdate(userId, userData, { new: true });

        if (!updatedUser) {
            // If the user with the given ID is not found
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser); // Return the updated user data
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID and delete it
        const deletedUser = await user.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            // If the user with the given ID is not found
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
  
  module.exports = router;