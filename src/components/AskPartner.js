import React, { useCallback, useRef } from 'react';
import { CLIENT_SET_PARTNER } from '../Constants';
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
  return <div>
    <div>Who do you want to play with ?</div>
    <select ref={inputRef} name="pets" id="pet-select">
      <option value="">--Please choose a player--</option>
      {names.map(name => <option key={name} value={name}>{name}</option>)}
    </select>
    <div><input type="submit" onClick={onSubmit} /></div>
  </div>;
};
