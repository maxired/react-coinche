import React, { useEffect, useCallback, useRef } from 'react';
import { CLIENT_SET_NAME } from '../Constants';
import { qs } from '../App';
export const AskName = ({ send }) => {
  const inputRef = useRef();
  const onSubmit = useCallback(() => {
    send({
      type: CLIENT_SET_NAME,
      payload: {
        name: inputRef.current.value
      }
    });
  }, [send]);
  useEffect(() => {
    if (qs.name) {
      send({
        type: CLIENT_SET_NAME,
        payload: {
          name: qs.name
        }
      });
    }
  }, [send]);
  return <div>
    <div>We need you to enter a player name</div>
    <div><input type="text" placeholder="Player Name" ref={inputRef} /></div>
    <div><input type="submit" onClick={onSubmit} /></div>
  </div>;
};
