import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is already connected on page load
  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setConnected(true);
          await getBalance(accounts[0], web3Instance);
          await getNetwork(web3Instance);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length > 0) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setConnected(true);
        
        // Get balance and network info
        await getBalance(accounts[0], web3Instance);
        await getNetwork(web3Instance);
        
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setError(error.message);
      setLoading(false);
      return false;
    }
  };

  const connectWalletConnect = async () => {
    // WalletConnect integration (placeholder for now)
    setError('WalletConnect integration coming soon!');
    return false;
  };

  const connectCoinbaseWallet = async () => {
    // Coinbase Wallet integration (placeholder for now)  
    setError('Coinbase Wallet integration coming soon!');
    return false;
  };

  const disconnect = () => {
    setWeb3(null);
    setAccount(null);
    setConnected(false);
    setBalance('0');
    setNetwork(null);
    setError(null);
  };

  const getBalance = async (address, web3Instance) => {
    try {
      const balanceWei = await web3Instance.eth.getBalance(address);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const getNetwork = async (web3Instance) => {
    try {
      const chainId = await web3Instance.eth.getChainId();
      const networks = {
        1: 'Ethereum Mainnet',
        5: 'Goerli Testnet',
        137: 'Polygon Mainnet',
        80001: 'Polygon Mumbai',
        56: 'BSC Mainnet',
        97: 'BSC Testnet'
      };
      setNetwork(networks[chainId] || `Chain ID: ${chainId}`);
    } catch (error) {
      console.error('Error getting network:', error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0]);
      if (web3) {
        getBalance(accounts[0], web3);
      }
    }
  };

  const handleChainChanged = () => {
    // Reload the page on chain change
    window.location.reload();
  };

  const switchToPolygon = async () => {
    if (!window.ethereum) return false;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon Mainnet
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        // Network not added, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              rpcUrls: ['https://polygon-rpc.com'],
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              blockExplorerUrls: ['https://polygonscan.com/'],
            }],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Polygon network:', addError);
          return false;
        }
      }
      console.error('Error switching to Polygon:', error);
      return false;
    }
  };

  const getShortAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const value = {
    web3,
    account,
    connected,
    balance,
    network,
    loading,
    error,
    connectMetaMask,
    connectWalletConnect,
    connectCoinbaseWallet,
    disconnect,
    switchToPolygon,
    getShortAddress,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
