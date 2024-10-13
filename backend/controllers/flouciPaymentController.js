const axios = require('axios');

module.exports = {
  // Add (Initiate Payment)
  Add: async (req, res) => {
    const url = "https://developers.flouci.com/api/generate_payment";
    
    const payload = {
      "app_token": "ae056881-78c8-415a-8f99-5add54a2ed92",  // Replace with your app public token
      "app_secret": process.env.FLOUCI_SECRET,  // Use secret from env variables
      "amount": req.body.amount,
      "accept_card": "true",
      "session_timeout_secs": 1200,
      "success_link": "http://localhost:5000/success",  // Define your success link
      "fail_link": "http://localhost:5000/fail",  // Define your fail link
      "developer_tracking_id": "0fba302c-a400-4bdb-8593-77f28174e375"
    };

    await axios
      .post(url, payload)
      .then(result => {
        // Log the result to verify the returned transaction ID
        console.log("Payment initiated successfully:", result.data);
        res.send(result.data);  // Return the full response to the client
      })
      .catch(err => {
        console.error(err.response ? err.response.data : err.message); // Log detailed error
        res.status(500).send('Error initiating payment');
      });
  },

  // Verify Payment
  Verify: async (req, res) => {
    const id_payment = req.params.id;  // Ensure this ID is correct and valid
    const url = `https://developers.flouci.com/api/verify_payment/${id_payment}`;

    await axios.get(url, {
      headers: {
        'apppublic': 'ae056881-78c8-415a-8f99-5add54a2ed92',  // Replace with your app public token
        'appsecret': process.env.FLOUCI_SECRET  // Use secret from env variables
      }
    })
    .then(result => {
      console.log(result.data); // Log the full response for debugging
      res.send(result.data);    // Return the data from Flouci
    })
    .catch(err => {
      console.error(err.response ? err.response.data : err.message); // Log more details on the error
      res.status(500).send('Error verifying payment');
    });
  }
};
