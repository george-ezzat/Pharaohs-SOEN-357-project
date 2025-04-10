// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search

  // Fetch products from your Express API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category first…
  const categoryFiltered =
    filter === 'all'
      ? products
      : products.filter(product => product.category === filter);

  // …then filter them with the search query (case-insensitive match on name)
  const displayedProducts = categoryFiltered.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container my-4">
      <h1>ScanLocal</h1>
      
      {/* Search Bar */}
      <div className="mb-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Category Filter Buttons */}
      <div className="btn-group my-3" role="group">
        {['all', 'food', 'furniture', 'games', 'health', 'sports'].map(category => (
          <button 
            key={category} 
            className={`btn btn-${filter === category ? 'primary' : 'outline-primary'}`}
            onClick={() => setFilter(category)}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="row">
        {displayedProducts.map(product => (
          <div className="col-md-4 mb-4" key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;
