import React, { useEffect, useCallback, useRef } from 'react';
import Server from '../server';
import { qs } from '../App';
export const RenderConnection = ({ serverInfo, setServerInfo }) => {
  const inputRef = useRef();
  const startServer = useCallback((d) => {
    Server(null, (error, _serverInfo) => setServerInfo(_serverInfo));
  }, [setServerInfo]);
  const onSubmitConnect = useCallback(() => {
    setServerInfo({ shortId: inputRef.current.value });
  }, [setServerInfo]);
  useEffect(() => {
    if (qs.setServerId) {
      Server(qs.setServerId, (error, _serverInfo) => setServerInfo(_serverInfo));
    }
    else if (qs.serverId) {
      setServerInfo({ shortId: qs.serverId });
    }
  }, [setServerInfo]);
  
  if (serverInfo.shortId) {
    return <div style={{position: 'absolute', top: 10, left: 10, zIndex: 3}}>serverInfo ID {serverInfo.shortId}</div>;
  }

  return (<div>
    <div><button onClick={startServer}>Start New Server</button></div>
    <div>or</div>
    <div>
      <div>Connect to existing Server</div>
      <div><input type="text" placeholder="enter server id" ref={inputRef} /></div>
      <div><input type="submit" onClick={onSubmitConnect} /></div>
    </div>
  </div>);
};
