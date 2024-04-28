import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Alert = ({ message, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      onClose();
    }, 5000); // Close the alert automatically after 1.5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const closeAlert = () => {
    setIsOpen(false);
    onClose();
  };

  return ReactDOM.createPortal(
    isOpen ? (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        <p>{message}</p>
        <button className="mt-4 bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded block mx-auto" onClick={closeAlert}>OK</button>
      </div>
    ) : null,
    document.body
  );
};

Alert.showAlert = (msg) => {
  const alertRoot = document.createElement('div');
  document.body.appendChild(alertRoot);

  const closeAlert = () => {
    ReactDOM.unmountComponentAtNode(alertRoot);
    document.body.removeChild(alertRoot);
  };

  ReactDOM.render(<Alert message={msg} onClose={closeAlert} />, alertRoot);
};

export default Alert;
