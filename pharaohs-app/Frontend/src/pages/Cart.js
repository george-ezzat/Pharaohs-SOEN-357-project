// src/pages/Cart.js
import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', cardType: '' });
  const [paymentMessage, setPaymentMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/users/${user._id}`)
        .then(res => res.json())
        .then(data => {
          setCart(data.cart || []);
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
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardChange = e => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          cardNumber: cardDetails.cardNumber,
          cardType: cardDetails.cardType
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPaymentMessage("Payment Successful! Receipt has been generated.");
        setCart([]);
      } else {
        setPaymentMessage(data.message || "Payment failed.");
      }
    } catch (err) {
      console.error(err);
      setPaymentMessage("An error occurred during payment.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container my-4">
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
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
      )}
      {cart.length > 0 && (
        <div className="my-4">
          <h3>Checkout</h3>
          <form onSubmit={handlePaymentSubmit}>
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">Card Number</label>
              <input type="text" className="form-control" id="cardNumber" name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="cardType" className="form-label">Card Type</label>
              <input type="text" className="form-control" id="cardType" name="cardType" value={cardDetails.cardType} onChange={handleCardChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Pay Now</button>
          </form>
          {paymentMessage && <p>{paymentMessage}</p>}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default Cart;
