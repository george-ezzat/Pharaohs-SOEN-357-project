// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase'; // our Firestore instance

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    };

    fetchProducts();
  }, []);

  // Filter products based on selected category
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter);

  return (
    <div className="container my-4">
      <h1>ScanLocal</h1>
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
        {filteredProducts.map(product => (
          <div className="col-md-4 mb-4" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;
