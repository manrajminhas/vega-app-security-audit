import React from 'react';

const renderStatusMessage = (message, isSuccess) => (
  message && (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: isSuccess ? 'green' : 'red',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  )
);

export default renderStatusMessage;