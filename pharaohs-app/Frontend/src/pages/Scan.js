// src/pages/Scan.js
import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Scan = () => {
  const [data, setData] = useState('Not Found');
  const [lookupResult, setLookupResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (err, result) => {
    if (result) {
      const scannedBarcode = result.text;
      setData(scannedBarcode);
      setLookupResult(null);
      setLoading(true);
      try {
        // Call the backend endpoint with the scanned barcode
        const response = await fetch(`http://localhost:5000/api/products/canadian?barcode=${scannedBarcode}`);
        const json = await response.json();
        if (response.ok) {
          setLookupResult(
            json.isCanadianMade 
              ? "This product is Canadian made." 
              : "This product is not Canadian made."
          );
        } else {
          setLookupResult("Product lookup failed.");
        }
      } catch (error) {
        console.error(error);
        setLookupResult("Error during product lookup.");
      }
      setLoading(false);
    } else if (err) {
      console.error(err);
    }
  };

  return (
    <div className="container my-4">
      <h2>Scan Barcode</h2>
      <div style={{ maxWidth: '400px', margin: 'auto' }}>
        <BarcodeScannerComponent
          width={400}
          height={300}
          onUpdate={handleUpdate}
        />
      </div>
      <p><strong>Scanned Barcode:</strong> {data}</p>
      {loading && <p>Looking up product...</p>}
      {lookupResult && <p><strong>Lookup Result:</strong> {lookupResult}</p>}
      <BottomNav />
    </div>
  );
};

export default Scan;
