import React from 'react';
import { computedPositionStyle } from './RenderMat';
export const PlayerPositions = ({ step }) => <React.Fragment>
  <div style={computedPositionStyle({ step, position: 'N' })}>North - {step.positions.N}</div>
  <div style={computedPositionStyle({ step, position: 'S' })}>South - {step.positions.S}</div>
  <div style={computedPositionStyle({ step, position: 'E' })}>East - {step.positions.E}</div>
  <div style={computedPositionStyle({ step, position: 'W' })}>West - {step.positions.W}</div>
</React.Fragment>;
