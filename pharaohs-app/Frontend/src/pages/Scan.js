import React, { useState } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
import BottomNav from '../components/BottomNav';

const Scan = () => {

  const [barcodeData, setBarcodeData] = useState("Not Found");
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetected = async (code) => {
    setBarcodeData(code);
    setProductDetails(null);
    setLoading(true);
    try {
   
      const response = await fetch(`http://localhost:5000/api/products/lookup?barcode=${code}`);
      const json = await response.json();
      if (response.ok) {
        const details = {
          productName: json.productName || "N/A",
          description: json.description || "No description available.",
          brand: json.brand || "N/A",
          category: json.category || "N/A",
          isCanadianMade: json.isCanadianMade
        };
        setProductDetails(details);
      } else {
        setProductDetails({ error: json.message || "Product lookup failed." });
      }
    } catch (error) {
      console.error("Lookup error:", error);
      setProductDetails({ error: "Error during product lookup." });
    }
    setLoading(false);
  };

  return (
    <div className="container my-4" style={{ textAlign: 'center' }}>
      <h2 style={{ color: 'white', marginBottom: '1rem' }}>Scan Barcode</h2>

      {/* Centered Camera Scanner */}
      <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem'
      }}>
        <BarcodeScanner onDetected={handleDetected} />
      </div>

      {/* Display Scanned Barcode or Loading State */}
      {loading ? (
        <p style={{ color: 'white', marginBottom: '1rem' }}>
          Looking up product details...
        </p>
      ) : (
        <p style={{ color: 'white', marginBottom: '1rem' }}>
          <strong>Scanned Barcode:</strong> {barcodeData}
        </p>
      )}

      {/* Display Product Info */}
      {productDetails && !productDetails.error && (
        <div style={{ 
          textAlign: 'left', 
          maxWidth: '400px', 
          margin: 'auto', 
          color: 'white', 
          fontSize: '1.2rem',
          background: 'rgba(0,0,0,0.4)', 
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Product Name:</strong> {productDetails.productName}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Description:</strong> {productDetails.description}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Brand:</strong> {productDetails.brand}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Category:</strong> {productDetails.category}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Status:</strong>{" "}
            <span style={{ 
              color: productDetails.isCanadianMade ? 'lightgreen' : 'salmon', 
              fontWeight: 'bold' 
            }}>
              {productDetails.isCanadianMade ? 'Canadian Made' : 'Not Canadian Made'}
            </span>
          </div>
        </div>
      )}
      {productDetails && productDetails.error && (
        <p style={{ color: 'white' }}>{productDetails.error}</p>
      )}

      <BottomNav />
    </div>
  );
};

export default Scan;
