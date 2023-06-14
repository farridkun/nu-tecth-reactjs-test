import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth';
import { setAccessToken } from '../utils/LocalStorage';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
      setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
      setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      if (email === '' || password === '') {
        setError('Email and password are required');
        return;
      }

      try {
      const response = await auth.login(email, password);
      setAccessToken(response.token);

      navigate('/');
      window.location.reload();
      } catch (error) {
      setError(error.message);
      }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-red-500 to-orange-400">
      <div className='max-w-md w-full p-6 mb-2 border border-orange-600 bg-gradient-to-r from-orange-300 shadow-lg rounded-md'>
        <h2 className='text-lg font-bold mb-2'>Dummy account testing:</h2>
        <p className='text-md font-bold'>Email: test@test.com</p>
        <p className='text-md font-bold'>Password: test123</p>
      </div>
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl text-center font-bold">Nutech test - Farrid Kuntoro</h2>
        <p className="text-xl text-center mb-6">Login to access</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-red-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-red-300"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Sign In
          </button>
          <div className="flex justify-end">
            <a href="/register" className="text-sm hover:underline hover:text-red-500">
              Don't have account? Sign Up Now
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
