import React from 'react';
import { Modal, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useWeb3 } from '../contexts/Web3Context';

const WalletModal = ({ show, onHide }) => {
  const { 
    connectMetaMask, 
    connectWalletConnect, 
    connectCoinbaseWallet, 
    loading, 
    error 
  } = useWeb3();

  const handleWalletConnect = async (walletType) => {
    let success = false;
    
    switch (walletType) {
      case 'metamask':
        success = await connectMetaMask();
        break;
      case 'walletconnect':
        success = await connectWalletConnect();
        break;
      case 'coinbase':
        success = await connectCoinbaseWallet();
        break;
      default:
        break;
    }

    if (success) {
      onHide();
    }
  };

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect using browser extension',
      icon: '🦊',
      available: typeof window !== 'undefined' && window.ethereum
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Scan with mobile wallet',
      icon: '📱',
      available: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect with Coinbase Wallet',
      icon: '🔵',
      available: true
    }
  ];

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Connect Your Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        <p className="text-muted mb-4">
          Connect your wallet to start bidding on properties and managing your real estate portfolio.
        </p>

        <Row className="g-3">
          {wallets.map((wallet) => (
            <Col xs={12} key={wallet.id}>
              <Button
                variant="outline-primary"
                className="w-100 p-3 d-flex align-items-center justify-content-between"
                onClick={() => handleWalletConnect(wallet.id)}
                disabled={loading || !wallet.available}
                style={{ 
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="d-flex align-items-center">
                  <span 
                    style={{ fontSize: '24px', marginRight: '12px' }}
                  >
                    {wallet.icon}
                  </span>
                  <div className="text-start">
                    <div className="fw-bold">{wallet.name}</div>
                    <small className="text-muted">{wallet.description}</small>
                  </div>
                </div>
                
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <span>→</span>
                )}
              </Button>
            </Col>
          ))}
        </Row>

        {!window.ethereum && (
          <Alert variant="info" className="mt-3">
            <strong>Don't have MetaMask?</strong>
            <br />
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              Install MetaMask →
            </a>
          </Alert>
        )}

        <div className="mt-4 p-3 bg-light rounded">
          <h6>Why connect your wallet?</h6>
          <ul className="mb-0 small text-muted">
            <li>Bid on premium real estate properties</li>
            <li>Secure cryptocurrency transactions</li>
            <li>Access your personalized dashboard</li>
            <li>Track your investment portfolio</li>
          </ul>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WalletModal;
