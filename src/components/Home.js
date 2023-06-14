import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductForm from './AddProductForm';
import { products } from '../services/products';
import Navbar from './Navbar';
import { auth } from '../services/auth';
import { getName } from '../utils/LocalStorage';

const Home = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const popupRef = useRef(null);

  useEffect(() => {
    const initListProducts = async () => {
      const response = await products.list();
      setLists(response);
    };

    initListProducts();
  }, []);

  useEffect(() => {
    const filtered = lists.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [lists, searchTerm]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowAddProductForm(false);
      }
    };

    if (showAddProductForm) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showAddProductForm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
    setShowAddProductForm(true);
  };

  const handleDeleteProduct = (productId) => {
    setSelectedProductId(productId);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    const updatedProducts = lists.filter((product) => product.id !== selectedProductId);
    await products.delete(selectedProductId);
    setLists(updatedProducts);
    setSelectedProductId(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setSelectedProductId(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleAddProduct = () => {
    setShowAddProductForm(true);
  };

  const handleProductAdded = async (newProduct) => {
    if (selectedProductId) {
      const updatedProducts = lists.map((product) =>
        product.id === selectedProductId ? newProduct : product
      );

      await products.update(selectedProductId, newProduct);
      setLists(updatedProducts);
      setSelectedProductId(null);
    } else {
      const response = await products.add(newProduct);
      setLists((prevLists) => [...prevLists, response]);
    }
    setShowAddProductForm(false);
  };

  const handleFormClose = () => {
    setShowAddProductForm(false);
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className='bg-gradient-to-r from-red-500 to-orange-400'>
      <Navbar user={getName()} onLogout={handleLogout} />
      <div className="container mx-auto p-4 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <button
            onClick={handleAddProduct}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Add Product
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-red-300"
          />
        </div>
        <table className="w-full border-collapse">
          <thead className="bg-red-500 text-white">
            <tr>
              <th className="border py-2 px-4">Image</th>
              <th className="border py-2 px-4">Name</th>
              <th className="border py-2 px-4">Buy Price</th>
              <th className="border py-2 px-4">Sell Price</th>
              <th className="border py-2 px-4">Stock</th>
              <th className="border py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="border py-2 px-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                </td>
                <td className="border py-2 px-4">{product.name}</td>
                <td className="border py-2 px-4">${product.priceBuy}</td>
                <td className="border py-2 px-4">${product.priceSell}</td>
                <td className="border py-2 px-4">{product.stock}</td>
                <td className="border py-2 px-4">
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <ul className="flex items-center">
            {Array(Math.ceil(filteredProducts.length / productsPerPage))
              .fill()
              .map((_, index) => (
                <li
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`cursor-pointer py-2 px-4 rounded-full ${
                    currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </li>
              ))}
          </ul>
        </div>

        {showAddProductForm && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div ref={popupRef} className="bg-white rounded-lg p-6">
              <button
                onClick={handleFormClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <AddProductForm 
                onClose={handleFormClose}
                onProductAdded={handleProductAdded}
                listProducts={lists}
                existingProduct={selectedProductId ? lists.find((product) => product.id === selectedProductId) : null}
              />
            </div>
          </div>
        )}

        {isDeleteConfirmationOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded p-4">
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this product?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
