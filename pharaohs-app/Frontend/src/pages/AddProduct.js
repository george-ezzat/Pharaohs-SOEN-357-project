import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'food',
    description: '',
    imageUrl: '',
    rating: 0 
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const { name, price, category, description, imageUrl, rating } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          category,
          description,
          imageUrl,
          rating: parseInt(rating),
          userId: user._id
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Product added successfully!');
        navigate('/');
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
      <div className="form-container">
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
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">Rating (0-5)</label>
            <select id="rating" name="rating" className="form-select" value={rating} onChange={handleChange}>
              {[0,1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-custom">Add Product</button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export default AddProduct;
