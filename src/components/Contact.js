// src/components/Contact.js
import './Contact.css';
import React from 'react';

const Contact = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>If you have any questions or inquiries, feel free to reach out to us:</p>
      <ul>
        <li>Email: info@qgem.io</li>
        {/* Add more contact methods as needed */}
      </ul>
      {/* You can add a contact form here if needed */}
    </div>
  );
};

export default Contact;
