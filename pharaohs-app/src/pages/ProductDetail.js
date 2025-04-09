// src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import db from '../firebase';
import BottomNav from '../components/BottomNav';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.error("No such product!");
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container my-4">
      <button className="btn btn-light mb-3" onClick={() => navigate(-1)}>Back</button>
      <h2>{product.name}</h2>
      <img src={product.imageUrl} alt={product.name} className="img-fluid" />
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
      {/* You could also display alternatives here */}
      <BottomNav />
    </div>
  );
};

export default ProductDetail;
