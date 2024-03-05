// src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaTiktok, FaDiscord, FaYoutube, FaTelegram, FaInstagram, FaInfo, FaEnvelope } from 'react-icons/fa'; // Importing icons
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-nav">
          <Link to="/about" className="social-icon"><FaInfo /></Link> {/* FaInfo for About */}
          <Link to="/contact" className="social-icon"><FaEnvelope /></Link> {/* FaEnvelope for Contact */}
          {/* Social media icons */}
          <a href="https://www.tiktok.com/@qgem.io" className="social-icon"><FaTiktok /></a>
          <a href="https://discord.gg/CjUxfaAr" className="social-icon"><FaDiscord /></a>
          <a href="https://youtu.be/Qj7zq98l9IY?si=H9pikwbPBEO8Duuy" className="social-icon"><FaYoutube /></a>
          <a href="https://t.me/+3tQADr1Vz1pmZjg0" className="social-icon"><FaTelegram /></a>
          <a href="https://instagram.com/qgem.io
" className="social-icon"><FaInstagram /></a>
        </div>
        <p>&copy; {new Date().getFullYear()} Quantum Gem (QGEM). All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
