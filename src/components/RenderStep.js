import React from 'react';
import { STEP_WAITING, STEP_ASK_NAME, STEP_ASK_PARTNER, STEP_WATCH_CARDS, STEP_WATCH_SCORES, STEP_ASK_ANNOUNCE } from '../Constants';
import { RenderAnnoucementTable } from './RenderAnnoucementTable';
import { WatchCards } from './WatchCards';
import { AskPartner } from './AskPartner';
import { AskName } from './AskName';
import { WatchScores } from './WatchScores';
import { Waiting } from './Waiting';
export const RenderStep = ({ step = {}, send, cards, setCards }) => {
  switch (step.name) {
    case STEP_ASK_NAME: return <AskName send={send} />;
    case STEP_ASK_PARTNER: return <AskPartner send={send} step={step} />;
    case STEP_WAITING: return <Waiting />;
    case STEP_WATCH_CARDS: return <WatchCards step={step} cards={cards} setCards={setCards} send={send} />;
    case STEP_WATCH_SCORES: return <WatchScores step={step} send={send} />;
    case STEP_ASK_ANNOUNCE: return <div>
      <RenderAnnoucementTable step={step} send={send} />
      <WatchCards step={step} cards={cards} />
    </div>;
    default: return null;
  }
};
