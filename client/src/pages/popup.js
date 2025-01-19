import React, { useState, useEffect } from 'react';
import '../styles/Popup.css'; 

const Popup = ({ show, onClose, referralLink }) => {
  if (!show) 
    return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        <h2>Special Offer!</h2>
        <p>Get amazing benefits with this referral link:</p>
        <a href={referralLink} target="_blank" rel="noopener noreferrer">
          Claim Your Credit Card Offer
        </a>
      </div>
    </div>
  );
};

export default Popup;
