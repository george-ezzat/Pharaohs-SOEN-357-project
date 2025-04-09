// src/components/BottomNav.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaCamera, FaHome, FaSearch, FaUser, FaUserPlus } from 'react-icons/fa';

const BottomNav = () => {
  return (
    <nav className="bottom-nav fixed-bottom bg-light border-top">
      <ul className="nav justify-content-around">
        <li className="nav-item">
          <Link className="nav-link" to="/"><FaHome size={24} /></Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/scan"><FaCamera size={24} /></Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/search"><FaSearch size={24} /></Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/cart"><FaShoppingCart size={24} /></Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile"><FaUser size={24} /></Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/signup"><FaUserPlus size={24} /></Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/signin"><span style={{fontSize: "20px"}}>Sign In</span></Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;
