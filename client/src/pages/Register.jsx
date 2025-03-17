import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Form from '@radix-ui/react-form';
import { PersonIcon } from '@radix-ui/react-icons';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { username, email, password } = formData;
      const result = await register(username, email, password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-primary">
      <div className="max-w-md w-full space-y-8 bg-primary-light p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-secondary hover:text-secondary-light">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md">
            {error}
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
                  placeholder="johndoe"
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
                  placeholder="you@example.com"
                />
              </Form.Control>
            </div>
          </Form.Field>

          <Form.Field name="password">
            <div className="flex items-center justify-between">
              <Form.Label className="block text-sm font-medium text-gray-300">
                Password
              </Form.Label>
              <Form.Message
                className="text-sm text-red-500"
                match="valueMissing"
              >
                Please enter a password
              </Form.Message>
              <Form.Message
                className="text-sm text-red-500"
                match={(value) => value.length < 6}
              >
                Password must be at least 6 characters
              </Form.Message>
            </div>
            <div className="mt-1">
              <Form.Control asChild>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  minLength={6}
                />
              </Form.Control>
            </div>
          </Form.Field>

          <Form.Field name="confirmPassword">
            <div className="flex items-center justify-between">
              <Form.Label className="block text-sm font-medium text-gray-300">
                Confirm Password
              </Form.Label>
              <Form.Message
                className="text-sm text-red-500"
                match="valueMissing"
              >
                Please confirm your password
              </Form.Message>
            </div>
            <div className="mt-1">
              <Form.Control asChild>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                />
              </Form.Control>
            </div>
          </Form.Field>

          <div>
            <Form.Submit asChild>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <PersonIcon className="mr-2" /> Create Account
                  </>
                )}
              </button>
            </Form.Submit>
          </div>
        </Form.Root>

        <div className="text-sm text-center text-gray-400 mt-4">
          By signing up, you agree to our{' '}
          <a href="#" className="text-secondary hover:text-secondary-light">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-secondary hover:text-secondary-light">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default Register; 