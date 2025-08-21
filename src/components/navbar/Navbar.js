import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button, Badge, Dropdown } from "react-bootstrap";
import logo from "../../images/logo/logo.png";
import { useWeb3 } from "../../contexts/Web3Context";
import WalletModal from "../WalletModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";

function NavBar() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { connected, account, balance, network, disconnect, getShortAddress } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Connect wallet function
  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="py-3">
      <Container>
        <Navbar.Brand onClick={goHome} className="me-lg-5" style={{cursor: 'pointer'}}>
          <img className="logo" src={logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link onClick={() => scrollToSection('marketplace')} style={{cursor: 'pointer'}}>Marketplace</Nav.Link>
            <Nav.Link onClick={() => scrollToSection('about')} className="px-lg-3" style={{cursor: 'pointer'}}>
              About Us
            </Nav.Link>
            <Nav.Link onClick={() => scrollToSection('developers')} style={{cursor: 'pointer'}}>Developers</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div className="d-flex align-items-center order">
          <span className="line d-lg-inline-block d-none"></span>
          <i className="fa-regular fa-heart"></i>
          
          {!connected ? (
            <Button
              variant="primary"
              className="btn-primary d-none d-lg-inline-block"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </Button>
          ) : (
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="success" 
                className="d-none d-lg-inline-block"
                style={{ border: 'none', background: 'linear-gradient(45deg, #28a745, #20c997)' }}
              >
                <small className="me-2">{balance} ETH</small>
                {getShortAddress(account)}
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                <Dropdown.ItemText>
                  <div>
                    <strong>Account:</strong><br />
                    <small className="text-muted">{getShortAddress(account)}</small>
                  </div>
                  <div className="mt-2">
                    <strong>Network:</strong><br />
                    <small className="text-muted">{network}</small>
                  </div>
                  <div className="mt-2">
                    <strong>Balance:</strong><br />
                    <small className="text-muted">{balance} ETH</small>
                  </div>
                </Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item onClick={goToDashboard}>
                  📊 Admin Dashboard
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDisconnect}>
                  🚪 Disconnect Wallet
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </Container>
      
      <WalletModal 
        show={showWalletModal} 
        onHide={() => setShowWalletModal(false)} 
      />
    </Navbar>
  );
}

export default NavBar;
