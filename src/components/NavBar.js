import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import "./NavBar.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const NavBar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Function to close the dropdown when a link is clicked
  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  

  return (
    <>
      <header className="header">
        <div className="brand-container">
          <Link to="/" className="logo-link">
            <img src="/assets/logo.png" alt="QGEM Logo" className="qgem-logo" />
          </Link>
        </div>
        <div className="navbar-container">
          <nav className="navigation">
            <Link to="/dao" className="nav-link" onClick={closeDropdown}>
              DAO
            </Link>
            <Link to="/whitepaper" className="nav-link" onClick={closeDropdown}>
              Whitepaper
            </Link>
            <div className="nav-link games-dropdown" onClick={toggleDropdown}>
              Games
              {isDropdownVisible && (
                <div className="dropdown-content">
                  <Link
                    to="/quantum-rps"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    Quantum RPS
                  </Link>
                  <Link
                    to="/monopoly-landmark-legends"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    Monopoly: Landmark Legends
                  </Link>
                  <Link
                    to="/quantum-lottery"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    Quantum Lottery
                  </Link>
                  <Link
                    to="/quantum-football-manager"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    Quantum Football Manager
                  </Link>
                </div>
              )}
            </div>
          </nav>
          {/* <PhantomWalletButton /> */}
          <WalletMultiButton className="wallet-button-css"/>
        </div>
        <div className="mobile-wallet-btn">
        <WalletMultiButton className="wallet-button-css"/>
        </div>
        <HiMenu className="menu-icon" onClick={() => setShowModal(true)} />
      </header>

      {showModal &&
        createPortal(
          <div className="modal">
            <IoMdClose
              className="close-icon"
              onClick={() => setShowModal(false)}
            />

            <nav className="mobile-nav">
              <Link
                to="/ico"
                className="mobile-nav-link"
                onClick={() => setShowModal(false)}
              >
                ICO
              </Link>
              <Link
                to="/whitepaper"
                className="mobile-nav-link"
                onClick={() => setShowModal(false)}
              >
                Whitepaper
              </Link>
              <div
                className="mobile-nav-link games-dropdown"
                onClick={toggleDropdown}
              >
                Games
                {isDropdownVisible && (
                  <div className="dropdown-content">
                    <Link
                      to="/quantum-rps"
                      className="dropdown-item"
                      onClick={() => setShowModal(false)}
                    >
                      Quantum RPS
                    </Link>
                    <Link
                      to="/monopoly-landmark-legends"
                      className="dropdown-item"
                      onClick={() => setShowModal(false)}
                    >
                      Monopoly: Landmark Legends
                    </Link>
                    <Link
                      to="/quantum-lottery"
                      className="dropdown-item"
                      onClick={() => setShowModal(false)}
                    >
                      Quantum Lottery
                    </Link>
                    <Link
                      to="/quantum-football-manager"
                      className="dropdown-item"
                      onClick={() => setShowModal(false)}
                    >
                      Quantum Football Manager
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>,
          document.body
        )}
    </>
  );
};

export default NavBar;
