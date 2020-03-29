import React, { useCallback, useRef } from 'react';
import { CLIENT_SET_PARTNER } from '../Constants';
import { Box } from './Box';
import { Button } from './Button';
export const AskPartner = ({ send, step: { names = [] } }) => {
  const inputRef = useRef();
  const onSubmit = useCallback(() => {
    if (!inputRef.current.value)
      return;
    send({
      type: CLIENT_SET_PARTNER,
      payload: {
        name: inputRef.current.value
      }
    });
  }, [send]);
  return <Box>
    <div>Who do you want to play with ?</div>
    <select ref={inputRef} name="pets" id="pet-select">
      <option value="">--Please choose a player--</option>
      {names.map(name => <option key={name} value={name}>{name}</option>)}
    </select>
    <div><Button yellow onClick={onSubmit}>Jouer</Button></div>
  </Box>;
};
