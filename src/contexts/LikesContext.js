import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3 } from './Web3Context';

const LikesContext = createContext();

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};

export const LikesProvider = ({ children }) => {
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const { account, connected } = useWeb3();

  // Load likes from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('propertyLikes');
    const savedUserLikes = localStorage.getItem(`userLikes_${account}`);
    
    if (savedLikes) {
      try {
        setLikes(JSON.parse(savedLikes));
      } catch (error) {
        console.error('Error parsing saved likes:', error);
      }
    }
    
    if (savedUserLikes && connected) {
      try {
        setUserLikes(new Set(JSON.parse(savedUserLikes)));
      } catch (error) {
        console.error('Error parsing user likes:', error);
      }
    }
  }, [account, connected]);

  // Save likes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('propertyLikes', JSON.stringify(likes));
  }, [likes]);

  // Save user likes to localStorage whenever they change
  useEffect(() => {
    if (connected && account) {
      localStorage.setItem(`userLikes_${account}`, JSON.stringify([...userLikes]));
    }
  }, [userLikes, account, connected]);

  // Toggle like for a property
  const toggleLike = async (propertyId) => {
    if (!propertyId) return false;

    try {
      const isCurrentlyLiked = userLikes.has(propertyId);
      const newUserLikes = new Set(userLikes);
      const newLikes = { ...likes };

      if (isCurrentlyLiked) {
        // Unlike the property
        newUserLikes.delete(propertyId);
        newLikes[propertyId] = (newLikes[propertyId] || 1) - 1;
        if (newLikes[propertyId] < 0) newLikes[propertyId] = 0;
      } else {
        // Like the property
        newUserLikes.add(propertyId);
        newLikes[propertyId] = (newLikes[propertyId] || 0) + 1;
      }

      setUserLikes(newUserLikes);
      setLikes(newLikes);

      // Send to backend if connected
      if (connected && account) {
        await saveLikeToBackend(propertyId, !isCurrentlyLiked);
      }

      return !isCurrentlyLiked;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  };

  // Save like to backend
  const saveLikeToBackend = async (propertyId, liked) => {
    try {
      const response = await fetch('http://localhost:4000/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          userAddress: account,
          liked,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        console.error('Failed to save like to backend');
      }
    } catch (error) {
      console.error('Error saving like to backend:', error);
    }
  };

  // Check if a property is liked by current user
  const isLiked = (propertyId) => {
    return userLikes.has(propertyId);
  };

  // Get total likes for a property
  const getLikesCount = (propertyId) => {
    return likes[propertyId] || 0;
  };

  // Get all user's liked properties
  const getUserLikedProperties = () => {
    return [...userLikes];
  };

  // Initialize property with some likes (for demo purposes)
  const initializePropertyLikes = (propertyId, initialCount = 0) => {
    if (!likes[propertyId]) {
      setLikes(prev => ({
        ...prev,
        [propertyId]: initialCount
      }));
    }
  };

  // Load likes from backend for a user
  const loadUserLikesFromBackend = async (userAddress) => {
    try {
      const response = await fetch(`http://localhost:4000/api/likes/user/${userAddress}`);
      if (response.ok) {
        const data = await response.json();
        const likedProperties = data.likes.map(like => like.propertyId);
        setUserLikes(new Set(likedProperties));
      }
    } catch (error) {
      console.error('Error loading user likes from backend:', error);
    }
  };

  // Load all likes for properties from backend
  const loadAllLikesFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/likes/all');
      if (response.ok) {
        const data = await response.json();
        const likesCount = {};
        
        data.likes.forEach(like => {
          likesCount[like.propertyId] = (likesCount[like.propertyId] || 0) + 1;
        });
        
        setLikes(likesCount);
      }
    } catch (error) {
      console.error('Error loading likes from backend:', error);
    }
  };

  const value = {
    likes,
    userLikes,
    toggleLike,
    isLiked,
    getLikesCount,
    getUserLikedProperties,
    initializePropertyLikes,
    loadUserLikesFromBackend,
    loadAllLikesFromBackend,
  };

  return (
    <LikesContext.Provider value={value}>
      {children}
    </LikesContext.Provider>
  );
};
