import React, { useCallback } from 'react';
import { DisplayScoresStack } from "./DisplayScoresStack";
import { DisplayScores } from "./DisplayScores";
import { Button } from "./Button";
import { CLIENT_VALIDATE_SCORE } from '../Constants';

export const WatchScores = ({ step, send }) => {
  // show score
  const valideScore = useCallback(() => {
    send({ type: CLIENT_VALIDATE_SCORE })
  }, [send])

  return <div style={{ backgroundColor: '#006D34', minHeight: 500 }}>
    <div>
      NS : <DisplayScores scores={step.scores.NS} />
      <DisplayScoresStack cards={step.stacks.NS} />
    </div>
    <div>
      EW : <DisplayScores scores={step.scores.EW} />
      <DisplayScoresStack cards={step.stacks.EW} />
    </div>
    <Button onClick={valideScore} >Validate Score</Button>
  </div>;
};
