import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Payment = () => {
  const [paymentData, setPaymentData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch cart details and compute total
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/users/${user._id}`)
        .then(res => res.json())
        .then(data => {
          setCart(data.cart || []);
          const t = (data.cart || []).reduce((acc, item) => acc + item.price, 0);
          setTotal(t);
        })
        .catch(err => console.error(err));
    } else {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Auto-format card number into groups of 4 digits
  const handleCardNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 16) input = input.slice(0, 16);
    const formatted = input.match(/.{1,4}/g)?.join(' ') || '';
    setPaymentData({ ...paymentData, cardNumber: formatted });
  };

  // Auto-format expiry date into MM/YY
  const handleExpiryChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 4) input = input.slice(0, 4);
    if (input.length > 2) {
      input = input.slice(0,2) + '/' + input.slice(2);
    }
    setPaymentData({ ...paymentData, expiryDate: input });
  };

  const handleChange = e => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { cardHolder, cardNumber, expiryDate, cvv } = paymentData;
    const plainCardNumber = cardNumber.replace(/\s/g, '');
    if (plainCardNumber.length !== 16) {
      setError('Card number must be 16 digits.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError('Expiry date must be in MM/YY format.');
      return;
    }
    if (!/^\d{3}$/.test(cvv)) {
      setError('CVV must be 3 digits.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          cardHolder,
          cardNumber,
          expiryDate,
          cvv
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Payment Successful!");
        navigate('/profile');
      } else {
        setError(data.message || "Payment failed.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during payment.");
    }
  };

  return (
    <div className="container my-4">
      <h2>Payment</h2>
      <h4>Total: ${total.toFixed(2)}</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="cardHolder" className="form-label">Cardholder Name</label>
          <input
            type="text"
            className="form-control"
            id="cardHolder"
            name="cardHolder"
            value={paymentData.cardHolder}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cardNumber" className="form-label">Card Number</label>
          <input
            type="text"
            className="form-control"
            id="cardNumber"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="xxxx xxxx xxxx xxxx"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="expiryDate" className="form-label">Expiry Date (MM/YY)</label>
          <input
            type="text"
            className="form-control"
            id="expiryDate"
            name="expiryDate"
            value={paymentData.expiryDate}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cvv" className="form-label">CVV</label>
          <input
            type="text"
            className="form-control"
            id="cvv"
            name="cvv"
            value={paymentData.cvv}
            onChange={handleChange}
            placeholder="123"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Pay Now</button>
      </form>
      <BottomNav />
    </div>
  );
};

export default Payment;
