// src/pages/Scan.js
import React, { useState } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
import BottomNav from '../components/BottomNav';

const Scan = () => {
  const [barcodeData, setBarcodeData] = useState("Not Found");
  const [lookupResult, setLookupResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetected = async (code) => {
    setBarcodeData(code);
    setLookupResult(null);
    setLoading(true);
    try {
      // Call the backend lookup endpoint with the detected barcode.
      const response = await fetch(`http://localhost:5000/api/products/lookup?barcode=${code}`);
      const json = await response.json();
      if (response.ok) {
        // Build a detailed message with the returned product details.
        const message = `
Product Name: ${json.productName || 'N/A'}
Description: ${json.description || 'No description available.'}
Brand: ${json.brand || 'N/A'}
Category: ${json.category || 'N/A'}
This product is ${json.isCanadianMade ? 'Canadian made' : 'not Canadian made'}.
        `;
        setLookupResult(message);
      } else {
        setLookupResult(json.message || "Product lookup failed.");
      }
    } catch (error) {
      console.error("Lookup error:", error);
      setLookupResult("Error during product lookup.");
    }
    setLoading(false);
  };

  return (
    <div className="container my-4">
      <h2>Scan Barcode</h2>
      <div style={{ maxWidth: '400px', margin: 'auto' }}>
        <BarcodeScanner onDetected={handleDetected} />
      </div>
      <p>
        <strong>Scanned Barcode:</strong> {barcodeData}
      </p>
      {loading && <p>Looking up product details...</p>}
      {lookupResult && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
          {lookupResult}
        </pre>
      )}
      <BottomNav />
    </div>
  );
};

export default Scan;
