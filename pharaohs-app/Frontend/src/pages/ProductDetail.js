import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  // Fetch a product by ID from the API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
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
      <BottomNav />
    </div>
  );
};

export default ProductDetail;
