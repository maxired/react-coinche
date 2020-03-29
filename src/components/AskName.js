import React, { useEffect, useCallback, useRef } from 'react';
import { CLIENT_SET_NAME } from '../Constants';
import { qs } from '../App';
import { Button } from './Button';
import { Box } from './Box';

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
  return <Box>
    <div>We need you to enter a player name</div>
    <div><input style={{fontSize: 24, margin: 8}} type="text" placeholder="Player Name" ref={inputRef} /></div>
    <div><Button yellow onClick={onSubmit} >Set name</Button></div>
    </Box>;
};


