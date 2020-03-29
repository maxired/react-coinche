import React from 'react';
import { RenderCard } from './RenderCard';
export const DisplayScoresStack = ({ cards }) => <div style={{ display: 'flex' }}>
  {cards.map((card) => <RenderCard key={card.full} card={card} style={{ width: 100 }} />)}
</div>;
