import React, { useCallback, useMemo } from 'react';
import { CLIENT_PLAY_CARD } from '../Constants';
import { RenderCard } from './RenderCard';

const positionsNames = {
  'N': 'North',
  'S': 'South',
  'E': 'East',
  'W': 'West'
}

const announceColorName = {
  'spades': 'Piques',
  'clubs': 'Trefles',
  'hearts': 'Coeurs',
  'diamonds': 'Carreaux'
}


export const WatchCards = ({ cards, step, setCards, send }) => {
  const sortedCards = useMemo(() => cards.sort((card1, card2) => card1.sort - card2.sort), [cards]);
  const playCard = useCallback((card) => {
    if (!step.isTurn || !setCards) return;
    setCards(cards.filter(_card => _card.full !== card.full));
    send({
      type: CLIENT_PLAY_CARD,
      payload: card
    });
  }, [step.isTurn, setCards, cards, send]);
  return <div>
      <div style={{
        position: 'absolute', top: 10, right: 10,
        color: step.isTurn ? 'black' : 'black',
        fontWeight:   step.isTurn ? 'bold' : 'normal',
        }}>
        {step.isTurn ? 'Your turn to play' : 'waiting for other to play'}     
      </div>
      <span>Your position : {positionsNames[step.position]}</span>
      <span>-</span>
      { step.player && <span>Your name : {step.player}</span>}
      <span>-</span>
      { step.announce && <span>{step.announce.value} {announceColorName[step.announce.color]}</span>}
    
    <div style={{ display: 'flex', maxWidth: '100vw' }}>
      {sortedCards.map((card) => <RenderCard key={card.full} card={card} playCard={playCard} style={{ flexShrink: 1 }} />)}
    </div>
  </div>;
};
