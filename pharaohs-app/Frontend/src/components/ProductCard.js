import React from 'react';
import { Link } from 'react-router-dom';
import { GiMapleLeaf } from 'react-icons/gi';

const ProductCard = ({ product }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleAddToCart = async () => {
    if (!user || user.role !== 'consumer') {
      alert("Only consumers can add products to the cart. Please sign in as a consumer.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product added to cart!");
      } else {
        alert(data.message || "Failed to add product to cart.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  // Create an array of 5 elements for the Canadian leaf rating.
  const renderRating = () => {
    return (
      <div className="mt-3" style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          i < product.rating
            ? <GiMapleLeaf key={i} color="red" size={28} />
            : <GiMapleLeaf key={i} color="#ccc" size={28} />
        ))}
      </div>
    );
  };

  return (
    <div className="card product-card">
      <img src={product.imageUrl} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">${product.price}</p>
        <div>
          {user && user.role === 'consumer' && (
            <button className="btn btn-outline-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}
          <Link to={`/product/${product._id}`} className="btn btn-primary ms-2">
            Details
          </Link>
        </div>
        {renderRating()}
      </div>
    </div>
  );
};

export default ProductCard;
