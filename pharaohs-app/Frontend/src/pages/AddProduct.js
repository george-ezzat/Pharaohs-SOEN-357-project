// src/pages/AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'food',
    description: '',
    imageUrl: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { name, price, category, description, imageUrl } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          category,
          description,
          imageUrl
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Product added successfully!');
        navigate('/'); // redirect to home page
      } else {
        setMessage(data.message || 'Failed to add product.');
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage('An error occurred while adding the product.');
    }
  };

  return (
    <div className="container my-4">
      <h2>Add Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
         <div className="mb-3">
           <label htmlFor="name" className="form-label">Product Name</label>
           <input type="text" className="form-control" id="name" name="name" value={name} onChange={handleChange} required />
         </div>
         <div className="mb-3">
           <label htmlFor="price" className="form-label">Price</label>
           <input type="number" className="form-control" id="price" name="price" value={price} onChange={handleChange} required />
         </div>
         <div className="mb-3">
           <label htmlFor="category" className="form-label">Category</label>
           <select id="category" name="category" className="form-select" value={category} onChange={handleChange}>
             <option value="food">Food</option>
             <option value="furniture">Furniture</option>
             <option value="games">Games</option>
             <option value="health">Health</option>
             <option value="sports">Sports</option>
           </select>
         </div>
         <div className="mb-3">
           <label htmlFor="description" className="form-label">Description</label>
           <textarea className="form-control" id="description" name="description" value={description} onChange={handleChange} required></textarea>
         </div>
         <div className="mb-3">
           <label htmlFor="imageUrl" className="form-label">Image URL</label>
           <input type="text" className="form-control" id="imageUrl" name="imageUrl" value={imageUrl} onChange={handleChange} />
         </div>
         <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
      <BottomNav />
    </div>
  );
};

export default AddProduct;
