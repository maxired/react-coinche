import React, { useCallback } from 'react';
import { STEP_WATCH_CARDS, CLIENT_GET_MAT } from '../Constants';
import { Button } from './Button'

const computeCardPosition = ({ step, card }) => {
  const orders = {
    N: { E: 'left', W: 'right', S: 'top', N: 'bottom' },
    S: { E: 'right', W: 'left', N: 'top', S: 'bottom' },
    E: { S: 'left', N: 'right', W: 'top', E: 'bottom' },
    W: { N: 'left', S: 'right', E: 'top', W: 'bottom' },
  };
  return orders[step.position][card.position];
};
const defaultPosition = {
  position: 'absolute',
  margin: 'auto',
  left: 10,
  right: 10,
  bottom: 10,
  top: 10,
  height: 30,
};
const oposite = {
  'top': 'bottom',
  'left': 'right',
  'right': 'left',
  'bottom': 'top'
};
const computedPositionStyle = ({ step, position }) => {
  const cardPosition = computeCardPosition({ step, card: { position } });
  return ({ ...defaultPosition, [oposite[cardPosition]]: null });
};
export const RenderMat = ({ cards, step, send }) => {
  const getMat = useCallback(() => {
    send({ type: CLIENT_GET_MAT });
  }, [send]);
  if (step.name !== STEP_WATCH_CARDS) return null
  
  return (<div style={{ position: 'relative', backgroundColor: '#006D34', height: 500, maxHeight: '75vh'  }}>
    {step.mat.map(card => {
      const cardPosition = computeCardPosition({ step, card });
      return <img alt={card.full} key={card.full} src={`${card.full}.svg`} style={{
        position: 'absolute',
        left: cardPosition === 'left' ? -150 : 0,
        right: cardPosition === 'right' ? -150 : 0,
        top: cardPosition === 'top' ? -150 : 0,
        bottom: cardPosition === 'bottom' ? -150 : 0,
        margin: 'auto',
        maxHeight: '50%'
      }} />;
    })}

    <div style={computedPositionStyle({ step, position: 'N' })}>North - {step.positions.N}</div>
    <div style={computedPositionStyle({ step, position: 'S' })}>South - {step.positions.S}</div>
    <div style={computedPositionStyle({ step, position: 'E' })}>East - {step.positions.E}</div>
    <div style={computedPositionStyle({ step, position: 'W' })}>West - {step.positions.W}</div>
    {step.mat.length === 4 && <div style={{ position: 'absolute', bottom: 10, right: '30%' }}>
      <Button onClick={getMat}>Ramasser</Button>
    </div>}
  </div>);
};


