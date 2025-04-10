// src/components/BarcodeScanner.js
import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init({
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment" 
          },
        },
        decoder: {
          // Include readers for various barcode formats.
          readers: ["upc_reader", "ean_reader", "ean_8_reader", "code_128_reader"],
        },
      }, (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected((data) => {
        if (onDetected && data && data.codeResult && data.codeResult.code) {
          onDetected(data.codeResult.code);
        }
      });
    }

    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, [onDetected]);

  return <div ref={scannerRef} style={{ width: "100%" }} />;
};

export default BarcodeScanner;
