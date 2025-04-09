// src/pages/Scan.js
import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Scan = () => {
  const [data, setData] = useState('Not Found');
  const navigate = useNavigate();

  const handleUpdate = (err, result) => {
    if (result) {
      setData(result.text);
      // Optionally, trigger a lookup in Firestore for the product using the barcode.
      // For example:
      // navigate(`/product/${result.text}`);
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
      <p>Scanned Data: {data}</p>
      <BottomNav />
    </div>
  );
};

export default Scan;
