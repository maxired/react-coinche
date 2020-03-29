import React from 'react';
export const RenderConnected = ({ connected = [] }) => {
  if (connected.length !== 4) {
    if (connected.length < 4) {
      return <div>Waiting {4 - connected.length} more people </div>;
    }
    else {
      return <div> Too many people</div>;
    }
  }
  return <div>Let's get started</div>;
};
