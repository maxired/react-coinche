import React, { useCallback } from 'react';
export const RenderCard = ({ card, playCard, style }) => {
  const onDoubleClick = useCallback(() => playCard && playCard(card), [card, playCard]);
  return (<div onDoubleClick={onDoubleClick} style={style}>
    <img src={`${card.full}.svg`} style={{maxWidth: '100%'}}/>
  </div>);
};
