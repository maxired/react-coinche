import React, { useCallback } from 'react';
import { STEP_WATCH_CARDS, CLIENT_GET_MAT, CLIENT_UNPLAY_CARD } from '../Constants';
import { Button } from './Button'
import { PlayerPositions } from './PlayerPositions';
import { TurnIndicator } from './TurnIndicator';

export const computeCardPosition = ({ step, card }) => {
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
export const computedPositionStyle = ({ step, position }) => {
  const cardPosition = computeCardPosition({ step, card: { position } });
  return ({ ...defaultPosition, [oposite[cardPosition]]: null });
};

export const RenderMat = ({ cards, step, setCards, send }) => {
  const getMat = useCallback(() => {
    send({ type: CLIENT_GET_MAT });
  }, [send]);
  if (step.name !== STEP_WATCH_CARDS) return null
  
  return (<div style={{ position: 'relative', textAlign: 'center', backgroundColor: '#006D34', height: 500, maxHeight: '75vh'  }}>
    {step.mat.map((card, cardIndex) => {
      const cardPosition = computeCardPosition({ step, card });

      return <img alt={card.full} key={card.full} src={`${card.full}.svg`} style={{
        position: 'absolute',
        left: cardPosition === 'left' ? -150 : 0,
        right: cardPosition === 'right' ? -150 : 0,
        top: cardPosition === 'top' ? -150 : 0,
        bottom: cardPosition === 'bottom' ? -150 : 0,
        margin: 'auto',
        maxHeight: '50%'
      }} onDoubleClick={() => {
        debugger;
        if(card.position === step.position && cardIndex === (step.mat.length -1 )){
          setCards([...cards, card]);
          send({
            type: CLIENT_UNPLAY_CARD,
            payload: card
          });
        }
      }}/>;
    })}

    <PlayerPositions step={step} />
    {step.mat.length === 4 && <div style={{ position: 'absolute', bottom: 10, right: '30%' }}>
      <Button yellow onClick={getMat}>Ramasser</Button>
    </div>}
    <TurnIndicator step={step} />
  </div>);
};


