import React from 'react';

export const Box = ({ style, ...props }) => <div style={{ backgroundColor: '#006D34', margin: 'auto', maxWidth: 800, padding: 200, fontSize: 24, ...style }} {...props} />;
