const express = require('express');
const { init, send } = require('emailjs-com');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Replace 'your_actual_user_id' and 'your_actual_service_id' with your EmailJS User ID and Service ID
init('M2nZ6qEBEoijAaW4m');

app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
  const { to_email, subject, message } = req.body;

  const templateParams = {
        to_email: auth.currentUser.email,
        subject: 'Your Story has been posted!',
        message: 'Thank you for posting your story. It has been successfully saved.',
      
  };

    send('service_xhrfr5c', 'template_fqd0s51', templateParams)
    .then((response) => {
      console.log('Email sent successfully:', response);
      res.status(200).json({ success: true });
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});