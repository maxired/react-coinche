import React, { useEffect, useState, useCallback } from 'react';
import Peer from 'peerjs';
import './App.css';
import { getServerFullId } from './server'
//const peer1 = new Peer(`@maxired/belote:${+new Date()}:${Math.floor(Math.random()*10000))}`); 
import {
  ON_OPEN, ON_DATA,
  GET_CLIENT, SET_CLIENT,
  SET_STEP, CLEAR_CARDS, ADD_CARDS} from './Constants';
import { RenderMat } from './components/RenderMat';
import { RenderConnection } from './components/RenderConnection';
import { RenderConnected } from './components/RenderConnected';
import { RenderStep } from './components/RenderStep';
import { addQueryParam } from './utils';


export const qs = document.location.search ? document.location.search.slice(1).split('&').reduce((memo, v) => {
  const [name, value] = v.split('=')
  memo[name] = value || true;
  return memo
  }, {}) : {}


function App() {
  const [serverInfo, setServerInfo] = useState({})
  const [clientCon, setClientCon] = useState(null)
  const [connected, setConnected] = useState([])
  const [currentStep, setStep] = useState({})
  const [cards, setCards] = useState([])
  useEffect(() => {
    if(serverInfo.shortId) {
      if(!qs.serverId && !qs.setServerId){
        addQueryParam(serverInfo.fullId ? 'setServerId' : 'serverId', serverInfo.shortId) 
      }
      const client = new Peer(qs.peerId || undefined, { host: 'jitsi.retrolution.co', port:  9000, path: '/myapp', secure: true}); 
      client.on(ON_OPEN, function(peerId) {
        if(!qs.peerId){
          addQueryParam('peerId', peerId)
        }
        const con = client.connect(getServerFullId(serverInfo.shortId));
        con.on(ON_OPEN, () => {
          setClientCon(con)
        });
      })
    }
  }, [serverInfo])


  useEffect(() => {
    if(!clientCon) return
    clientCon.send({ type: GET_CLIENT})
    clientCon.on(ON_DATA, ({ type, payload }) => {
      if(type === SET_CLIENT){
        setConnected(payload)
      }

      if(type === SET_STEP){
        setStep(payload)
      }

      if(type === CLEAR_CARDS){
        setCards([])
      }

      if(type === ADD_CARDS){
        setCards(currentCards => [...currentCards, ...payload.cards])
      }
    });
  }, [clientCon])

  const send = useCallback((...params) => {
    clientCon.send(...params)
  }, [clientCon])

  return (
    <div className="App">
      <RenderConnection serverInfo={serverInfo} setServerInfo={setServerInfo} />
      <RenderMat step={currentStep}  send={send} cards={cards} setCards={setCards} />
      <RenderStep step={currentStep} send={send} cards={cards} setCards={setCards} />
      <RenderConnected connected={connected} />   
    </div>
  );
}

export default App;
