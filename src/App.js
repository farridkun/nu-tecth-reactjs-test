import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { getAccessToken } from './utils/LocalStorage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const isAuthenticated = !!getAccessToken();

const PrivateRoute = ({ element: Element, ...rest }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Element {...rest} />;
};

function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <PrivateRoute element={Home} />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
