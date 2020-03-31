import React from 'react';
import { computeCardPosition } from './RenderMat';
export const TurnIndicator = ({ step }) => {
  if (!step.turnPosition)
    return null;
  const indicatorPosition = computeCardPosition({ step, card: { position: step.turnPosition } });
  return <div style={{
    width: 20,
    height: 20,
    borderRadius: 20,
    background: '#0E42D3',
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dashed',
    left: indicatorPosition === 'right' ? null : 125,
    right: indicatorPosition === 'left' ? null : 125,
    top: indicatorPosition === 'bottom' ? null : 30,
    bottom: indicatorPosition === 'top' ? null : 50,
    margin: 'auto',
    position: 'absolute',
  }}></div>;
};
