import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import * as Form from '@radix-ui/react-form';
import { getMovieById } from '../api/movieApi';
import useAuth from '../hooks/useAuth';
import MovieCard from '../components/MovieCard';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch favorite movies
  const { data: favoritesData, isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites', user?.favorites],
    queryFn: async () => {
      if (!user?.favorites?.length) return { data: [] };
      
      const moviePromises = user.favorites.map(id => getMovieById(id));
      const results = await Promise.all(moviePromises);
      return { data: results.filter(r => r.success).map(r => r.data) };
    },
    enabled: !!user?.favorites?.length,
  });

  // Fetch watchlist movies
  const { data: watchlistData, isLoading: watchlistLoading } = useQuery({
    queryKey: ['watchlist', user?.watchlist],
    queryFn: async () => {
      if (!user?.watchlist?.length) return { data: [] };
      
      const moviePromises = user.watchlist.map(id => getMovieById(id));
      const results = await Promise.all(moviePromises);
      return { data: results.filter(r => r.success).map(r => r.data) };
    },
    enabled: !!user?.watchlist?.length,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage({ type: '', text: '' });
    
    // Validate passwords match if changing password
    if (formData.password && formData.password !== formData.confirmPassword) {
      setUpdateMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    
    try {
      // Only include password if it's being changed
      const userData = {
        username: formData.username,
        email: formData.email,
        ...(formData.password ? { password: formData.password } : {}),
      };
      
      const result = await updateProfile(userData);
      
      if (result.success) {
        setUpdateMessage({ type: 'success', text: 'Profile updated successfully' });
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: '',
        }));
      } else {
        setUpdateMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setUpdateMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

        <Tabs.Root 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="bg-primary-light rounded-lg overflow-hidden"
        >
          <Tabs.List className="flex border-b border-gray-700">
            <Tabs.Trigger 
              value="account" 
              className={`px-6 py-4 text-lg font-medium transition-colors ${
                activeTab === 'account' 
                  ? 'text-white border-b-2 border-secondary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Account Settings
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="favorites" 
              className={`px-6 py-4 text-lg font-medium transition-colors ${
                activeTab === 'favorites' 
                  ? 'text-white border-b-2 border-secondary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Favorites
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="watchlist" 
              className={`px-6 py-4 text-lg font-medium transition-colors ${
                activeTab === 'watchlist' 
                  ? 'text-white border-b-2 border-secondary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Watchlist
            </Tabs.Trigger>
          </Tabs.List>

          {/* Account Settings Tab */}
          <Tabs.Content value="account" className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
            
            {updateMessage.text && (
              <div className={`mb-6 p-4 rounded-md ${
                updateMessage.type === 'success' 
                  ? 'bg-green-900/50 border border-green-500 text-green-300' 
                  : 'bg-red-900/50 border border-red-500 text-red-300'
              }`}>
                {updateMessage.text}
              </div>
            )}
            
            <Form.Root className="space-y-6" onSubmit={handleSubmit}>
              <Form.Field name="username">
                <div className="flex items-center justify-between">
                  <Form.Label className="block text-sm font-medium text-gray-300">
                    Username
                  </Form.Label>
                  <Form.Message
                    className="text-sm text-red-500"
                    match="valueMissing"
                  >
                    Please enter a username
                  </Form.Message>
                </div>
                <div className="mt-1">
                  <Form.Control asChild>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="input"
                      minLength={3}
                    />
                  </Form.Control>
                </div>
              </Form.Field>

              <Form.Field name="email">
                <div className="flex items-center justify-between">
                  <Form.Label className="block text-sm font-medium text-gray-300">
                    Email address
                  </Form.Label>
                  <Form.Message
                    className="text-sm text-red-500"
                    match="valueMissing"
                  >
                    Please enter your email
                  </Form.Message>
                  <Form.Message
                    className="text-sm text-red-500"
                    match="typeMismatch"
                  >
                    Please enter a valid email
                  </Form.Message>
                </div>
                <div className="mt-1">
                  <Form.Control asChild>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                    />
                  </Form.Control>
                </div>
              </Form.Field>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                <p className="text-gray-400 text-sm mb-4">Leave blank to keep your current password</p>
              </div>

              <Form.Field name="password">
                <div className="flex items-center justify-between">
                  <Form.Label className="block text-sm font-medium text-gray-300">
                    New Password
                  </Form.Label>
                  <Form.Message
                    className="text-sm text-red-500"
                    match={(value) => value.length > 0 && value.length < 6}
                  >
                    Password must be at least 6 characters
                  </Form.Message>
                </div>
                <div className="mt-1">
                  <Form.Control asChild>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input"
                      minLength={6}
                    />
                  </Form.Control>
                </div>
              </Form.Field>

              <Form.Field name="confirmPassword">
                <div className="flex items-center justify-between">
                  <Form.Label className="block text-sm font-medium text-gray-300">
                    Confirm New Password
                  </Form.Label>
                </div>
                <div className="mt-1">
                  <Form.Control asChild>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input"
                    />
                  </Form.Control>
                </div>
              </Form.Field>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Logout
                </button>
                
                <Form.Submit asChild>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </Form.Submit>
              </div>
            </Form.Root>
          </Tabs.Content>

          {/* Favorites Tab */}
          <Tabs.Content value="favorites" className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Your Favorites</h2>
            
            {favoritesLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : favoritesData?.data?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {favoritesData.data.map((movie) => (
                  <MovieCard key={movie.imdbId} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-primary rounded-lg">
                <p className="text-gray-400 mb-4">You haven't added any movies to your favorites yet.</p>
                <p className="text-gray-500">Browse movies and click the heart icon to add them here.</p>
              </div>
            )}
          </Tabs.Content>

          {/* Watchlist Tab */}
          <Tabs.Content value="watchlist" className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Your Watchlist</h2>
            
            {watchlistLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : watchlistData?.data?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {watchlistData.data.map((movie) => (
                  <MovieCard key={movie.imdbId} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-primary rounded-lg">
                <p className="text-gray-400 mb-4">You haven't added any movies to your watchlist yet.</p>
                <p className="text-gray-500">Browse movies and click the plus icon to add them here.</p>
              </div>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default Profile; 