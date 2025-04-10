// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';

const Home = () => {
  // Original state
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New sidebar filter state variables
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');

  // Fetch products on component mount
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

  // Apply filters in order:
  // 1. Top category filter
  const categoryFiltered =
    filter === 'all'
      ? products
      : products.filter(product => product.category === filter);
  // 2. Search query filter (by product name, case‑insensitive)
  const searchFiltered = categoryFiltered.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // 3. Price filter from sidebar
  const priceFiltered = searchFiltered.filter(product => {
    const meetsMin = minPrice === '' || product.price >= parseFloat(minPrice);
    const meetsMax = maxPrice === '' || product.price <= parseFloat(maxPrice);
    return meetsMin && meetsMax;
  });
  // 4. Minimum rating filter
  const displayedProducts = priceFiltered.filter(product =>
    minRating === '' || product.rating >= parseInt(minRating)
  );

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center">ScanLocal</h1>

      {/* Top search bar */}
      <div className="mb-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Top category filter buttons */}
      <div className="btn-group mb-3 d-flex justify-content-center" role="group">
        {['all', 'food', 'furniture', 'games', 'health', 'sports'].map(category => (
          <button 
            key={category} 
            className={`btn btn-${filter === category ? 'primary' : 'outline-primary'}`}
            onClick={() => setFilter(category)}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="row">
        {/* Left Sidebar: Price and Rating Filters */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Filters</h5>
              <div className="mb-3">
                <label htmlFor="minPrice" className="form-label">Min Price</label>
                <input 
                  type="number"
                  id="minPrice"
                  className="form-control"
                  placeholder="e.g., 0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="maxPrice" className="form-label">Max Price</label>
                <input 
                  type="number"
                  id="maxPrice"
                  className="form-control"
                  placeholder="e.g., 100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="minRating" className="form-label">Min Rating</label>
                <select
                  id="minRating"
                  className="form-select"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}>
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} and up</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main area: Display Products */}
        <div className="col-md-9">
          {/* Use a row with justify-content-center to center product cards */}
          <div className="row justify-content-center">
            {displayedProducts.map(product => (
              <div className="col-md-4 mb-4 d-flex align-items-stretch" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
