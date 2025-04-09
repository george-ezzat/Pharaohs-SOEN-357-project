// src/pages/Cart.js
import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/users/${user._id}`)
        .then(res => res.json())
        .then(data => {
          setCart(data.cart || []);
          const t = (data.cart || []).reduce((acc, item) => acc + item.price, 0);
          setTotal(t);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      navigate('/signin');
    }
  }, [user, navigate]);

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}/cart/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data.cart);
        const t = data.cart.reduce((acc, id) => {
          // We can re-fetch the entire cart on removal to update the total.
          return acc; // Alternatively, recompute total here if you have full details.
        }, 0);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container my-4">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="row">
            {cart.map(product => (
              <div className="col-md-4 mb-4" key={product._id}>
                <div className="card">
                  <img src={product.imageUrl} className="card-img-top" alt={product.name} />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">${product.price}</p>
                    <button className="btn btn-danger" onClick={() => removeFromCart(product._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h4>Total: ${total.toFixed(2)}</h4>
          <button className="btn btn-primary" onClick={() => navigate('/payment')}>
            Pay Now
          </button>
        </>
      )}
      <BottomNav />
    </div>
  );
};

export default Cart;
