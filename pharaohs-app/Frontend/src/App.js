import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Scan from './pages/Scan';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AddProduct from './pages/AddProduct';
import Profile from './pages/Profile';
import EditProduct from './pages/EditProduct';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
      </Routes>
    </div>
  );
}

export default App;
