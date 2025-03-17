import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
          
          // Set axios default headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Register user
  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users', {
        username,
        email,
        password,
      });

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        userData
      );

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      };
    }
  };

  // Add movie to favorites
  const addToFavorites = async (imdbId) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/favorites',
        { imdbId }
      );

      // Update user favorites in state
      setUser((prevUser) => ({
        ...prevUser,
        favorites: data.favorites,
      }));

      // Update localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      userInfo.favorites = data.favorites;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to favorites',
      };
    }
  };

  // Remove movie from favorites
  const removeFromFavorites = async (imdbId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/users/favorites/${imdbId}`
      );

      // Update user favorites in state
      setUser((prevUser) => ({
        ...prevUser,
        favorites: data.favorites,
      }));

      // Update localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      userInfo.favorites = data.favorites;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from favorites',
      };
    }
  };

  // Add movie to watchlist
  const addToWatchlist = async (imdbId) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/watchlist',
        { imdbId }
      );

      // Update user watchlist in state
      setUser((prevUser) => ({
        ...prevUser,
        watchlist: data.watchlist,
      }));

      // Update localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      userInfo.watchlist = data.watchlist;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to watchlist',
      };
    }
  };

  // Remove movie from watchlist
  const removeFromWatchlist = async (imdbId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/users/watchlist/${imdbId}`
      );

      // Update user watchlist in state
      setUser((prevUser) => ({
        ...prevUser,
        watchlist: data.watchlist,
      }));

      // Update localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      userInfo.watchlist = data.watchlist;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from watchlist',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addToFavorites,
        removeFromFavorites,
        addToWatchlist,
        removeFromWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 