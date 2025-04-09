// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [producerProducts, setProducerProducts] = useState([]);
  const [consumerData, setConsumerData] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/signin');
      return;
    }
    setUser(storedUser);
    fetch(`http://localhost:5000/api/users/${storedUser._id}`)
      .then(res => res.json())
      .then(data => setConsumerData(data))
      .catch(err => console.error(err));

    if (storedUser.role === 'producer') {
      fetch(`http://localhost:5000/api/users/${storedUser._id}/products`)
        .then(res => res.json())
        .then(data => setProducerProducts(data))
        .catch(err => console.error(err));
    } else {
      // For consumers, fetch receipts
      fetch(`http://localhost:5000/api/users/${storedUser._id}/receipts`)
         .then(res => res.json())
         .then(data => setReceipts(data))
         .catch(err => console.error(err));
    }
  }, [navigate]);

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setProducerProducts(producerProducts.filter(p => p._id !== productId));
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container my-4">
      <h2>{user.role === 'producer' ? 'Producer Profile' : 'Consumer Profile'}</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {user.role === 'producer' ? (
        <>
          <h3>My Listings</h3>
          {producerProducts.length === 0 ? (
            <p>No products listed.</p>
          ) : (
            <div className="row">
              {producerProducts.map(product => (
                <div className="col-md-4 mb-4" key={product._id}>
                  <div className="card">
                    <img src={product.imageUrl} className="card-img-top" alt={product.name} />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">${product.price}</p>
                      <Link to={`/edit-product/${product._id}`} className="btn btn-warning me-2">Edit</Link>
                      <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-primary" onClick={() => navigate('/add-product')}>
            Add New Product
          </button>
        </>
      ) : (
        <>
          <h3>My Cart</h3>
          {consumerData && (!consumerData.cart || consumerData.cart.length === 0) ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="row">
              {consumerData && consumerData.cart.map(product => (
                <div className="col-md-4 mb-4" key={product._id}>
                  <div className="card">
                    <img src={product.imageUrl} className="card-img-top" alt={product.name} />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">${product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {receipts && receipts.length > 0 && (
            <div>
              <h3>My Receipts</h3>
              {receipts.map(r => (
                <div key={r._id} className="card my-2">
                  <div className="card-body">
                    <h5 className="card-title">Receipt - ${r.total.toFixed(2)}</h5>
                    <p className="card-text">Purchased on: {new Date(r.date).toLocaleString()}</p>
                    <p className="card-text">Card: {r.paymentInfo.cardType} ending in {r.paymentInfo.cardLast4}</p>
                    <ul>
                      {r.products.map(item => (
                        <li key={item.productId}>{item.name} - ${item.price}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <BottomNav />
    </div>
  );
};

export default Profile;
