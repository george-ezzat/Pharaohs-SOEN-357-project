// src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card product-card">
      <img src={product.imageUrl} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">${product.price}</p>
        <button className="btn btn-outline-primary">Favorite</button>
        <Link to={`/product/${product._id}`} className="btn btn-primary ms-2">
          Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
