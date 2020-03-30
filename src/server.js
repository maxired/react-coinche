import Peer from 'peerjs';
import shuffle from 'lodash/fp/shuffle'

import { ON_OPEN, ON_DATA, ON_CONNECTION, PEER_SERVER_PREFIX, GET_CLIENT, SET_CLIENT, SET_STEP, STEP_ASK_NAME, CLIENT_SET_NAME, STEP_WAITING, STEP_ASK_PARTNER, CLIENT_SET_PARTNER, CLEAR_CARDS, ADD_CARDS, STEP_WATCH_CARDS, CLIENT_PLAY_CARD, CLIENT_GET_MAT, STEP_WATCH_SCORES, STEP_ASK_ANNOUNCE, CLIENT_ANNOUNCE, CLIENT_VALIDATE_ANNOUNCE, CLIENT_VALIDATE_SCORE } from './Constants';

export const getServerFullId = (shortId) => `${PEER_SERVER_PREFIX}-${shortId}`

const POINT_NO_ASSET = { '7': 0, '8':0, '9':0, 'jack':2, 'queen':3, 'king':4, '10':10, ace: 11 }
const POINT_ASSET = { '7': 0, '8':0, '9': 14, 'jack':20, 'queen':3, 'king':4, '10':10, ace: 11 }


const getValueForCardForColor = (card, color) => {
  if(card.color === color) return POINT_ASSET[card.value]
  return POINT_NO_ASSET[card.value]
}
const getScoresForCards = (cards, memo) => {
  if(cards.length === 0) return memo

  const [card, ...nextCards] = cards;
  Object.keys(memo).forEach(color => {
    memo[color] += getValueForCardForColor(card, color)
  })

  return getScoresForCards(nextCards, memo)
}

const createCards = () => ['hearts', 'spades', 'diamonds','clubs'].reduce((memo, color, indexColor) => {  
    return ['7', '8', '9', 'jack', 'queen', 'king', '10','ace'].reduce((memo, value,indexValue) => {
        memo.push({
          color,
          value,
          full: `${value}_of_${color}`,
          position: 'stack',
          sort: indexColor * 100 -  indexValue 
        })
        return memo
    }, memo)
},[])

const clients = {
  // peer: { // connection, step, name, team, cards, position }
}

const party = {
  round: 0,
  pli: 0,
  handStart: 'E',
  mat: [],
  stacks: {
    NS: [],
    EW: []
  },
  announce: {
    color: '',
    value: 80,
    valid: []
  },
  scores: {
    NS: 0,
    EW: 0,
    valid: [],
  }
}

const POSITIONS_ORDER = ['N', 'E', 'S', 'W']

const setStep = (client, stateName, values) => {
    clients[client.peer].step = stateName;
    client.send({
        type: SET_STEP,
        payload: {
            name: stateName,
            ...values
        }
    })
}

const dealWithClientData = (res, clientData) => {
  if (clientData.type === GET_CLIENT) {
    res.send({
      type: SET_CLIENT,
      payload: Object.keys(clients)
    })

    setStep(res, STEP_ASK_NAME)      
   } else if (clientData.type === CLIENT_SET_NAME) {
    clients[res.peer].name = clientData.payload.name;
    setStep(res, STEP_WAITING)
    setAskPartnerIfNeeded(res)
  } else if (clientData.type === CLIENT_SET_PARTNER) {
    Object.values(clients).forEach(client => {
      if (client.name === clientData.payload.name || client.connection === res) {
        client.team = 'NS'
      } else {
        client.team = 'EW'
      }
    });

    const NSTeam = Object.values(clients).filter(client => client.team === 'NS');
    const EWTeam = Object.values(clients).filter(client => client.team === 'EW');

    const NS_SEED  = Math.random() > 0.5
    const EW_SEED  = Math.random() > 0.5
  
    NSTeam[0].position = NS_SEED ? 'N' : 'S'
    NSTeam[1].position = !NS_SEED ? 'N' : 'S'
    
    EWTeam[0].position = EW_SEED ? 'E' : 'W'
    EWTeam[1].position = !EW_SEED ? 'E' : 'W'
    
    const cards = shuffle(createCards());
    party.round = 0
    party.pli = 0;
    party.announce = {
      color: '',
      count: 80,
      player: ''
    }
    distributeCard(cards, party)
  } else if (clientData.type === CLIENT_PLAY_CARD) {
    party.mat.push({
      ...clientData.payload
    })
 
    sendWatchCards();
  } else if (clientData.type === CLIENT_GET_MAT) {
    const client = clients[res.peer];
    party.stacks[['N', 'S'].includes(client.position) ? 'NS' : 'EW'].push(...party.mat)
    party.mat = [];
    party.handStart = client.position;
    party.pli += 1;
    if(party.pli < 8){
      sendWatchCards()
    } else {
      // send all card to see score
      const scoresNS = getScoresForCards(party.stacks.NS, { [party.announce.color]: 0 })
      const scoresEW = getScoresForCards(party.stacks.EW, { [party.announce.color]: 0 })
      if(['N', 'S'].includes(client.position)){
        // 10 de der
        Object.keys(scoresNS).forEach(key => scoresNS[key] += 10 )
      } else {
        Object.keys(scoresEW).forEach(key => scoresNS[key] += 10 )
      }
      party.scores.valid = []
      party.scores.NS += scoresNS[party.announce.color];
      party.scores.EW += scoresEW[party.announce.color];
      
      sendRoundScore(party.stacks, { NS: scoresNS[party.announce.color], EW: scoresEW[party.announce.color], announce: party.announce, totalScores: party.scores })
    }
  } else if (clientData.type === CLIENT_ANNOUNCE){
    const { color, value} = clientData.announce;
    party.announce.color = color;
    party.announce.value = value;
    party.announce.valid = [res.peer]
    party.announce.player = clients[res.peer].name
    sendAnnounce(party)
  } else if (clientData.type === CLIENT_VALIDATE_ANNOUNCE){
    const valid = party.announce.valid.filter(p => p !== res.peer)
    valid.push(res.peer);
    party.announce.valid = valid;
    if(party.announce.valid.length ===4) {
      sendWatchCards()
    } else {
      sendAnnounce(party)
    }
  } else if (clientData.type === CLIENT_VALIDATE_SCORE){
    const valid = party.scores.valid.filter(p => p !== res.peer)
    valid.push(res.peer);
    party.scores.valid = valid;
    if(party.scores.valid.length ===4) {
      // need to reset 
      party.pli = 0;
      party.announce = {
        color: '',
        count: 80,
        player: '',
        valid: []
      }
      // rassembler
      const stackedCards = [...party.stacks.NS, ...party.stacks.EW];
      //couper
      const splitIndex = getSplitIndex();
      const nextCards = [...stackedCards.slice(splitIndex), ...stackedCards.slice(0, splitIndex)]
      party.stacks.NS = []
      party.stacks.EW = []
      party.round +=1;
      party.handStart = POSITIONS_ORDER[(party.round + 1) % POSITIONS_ORDER.length];
      // distribuer
      distributeCard(nextCards, party)
    }
  }   
}

const getSplitIndex = () => {
  const percentage = [0,1,2,3,4,5,6,7,8,10,13,17,22,28,36,45,54,63,71,78,83,87,90,92,93,94,95,96,97,98,99,100]
  const indexex = [0 ,1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9 ,10 ,11 ,12 ,13 ,14 ,15 ,16 ,17 ,18 ,19 ,20 ,21 ,22 ,23 ,24 ,25 ,26 ,27 ,28 ,29 ,30 ,31]
  const percent = Math.floor(Math.random() * 100)

  const finalIndex = percentage.findIndex((value, index)=> {
    return value < percent && percentage[index+1] > percent
  })

  return indexex[finalIndex]
}

const setAskPartnerIfNeeded = (res) => {
  if(Object.values(clients).length === 4 && Object.values(clients).every(client => client.name)){
    setStep(res, STEP_ASK_PARTNER, { names: 
      Object.keys(clients).filter(key => key !== res.peer).map(key => clients[key].name)
    })
  }
}

const Server = (id, cb) => {
    const randomId = id || Math.floor(Math.random() * 10000)
    const peerServerId = getServerFullId(randomId)
    const serverPeer = new Peer(peerServerId, { host: 'jitsi.retrolution.co', port:  9000, path: '/myapp', secure: false} );
    
    serverPeer.on(ON_OPEN, function(id) {
      serverPeer.on(ON_CONNECTION, (p1_) => {
        clients[p1_.peer] = { connection: p1_ }
        p1_.on(ON_DATA, (clientData) => dealWithClientData(p1_, clientData))
      })

    setInterval(() => {
        // refresh client every 3 seconds
        Object.values(clients).forEach(({ connection }) => {
            connection.send({
                type: SET_CLIENT,
                payload: Object.keys(clients)
            })
        })
    }, 3000)

    setTimeout(() => cb(null, { shortId : randomId, fullId: peerServerId }), 300)
   })
}

const WAYS = [[3,3,2],[3,2,3],[2,3,3]];
  
const distributeCard = (cardPackage, party) => {
  // clear cards
  Object.values(clients).forEach(({ connection }) => {
    connection.send({ type: CLEAR_CARDS })
  })

  const way = WAYS[Math.floor(Math.random() * WAYS.length)]
  let total = 0
  way.forEach((way) => {
    [0, 1, 2, 3].forEach((personIndex) => {
      const cards = cardPackage.slice(total, total + way)
      total += way

      // need to send card ot the good perso
      const positionIndex = (party.round + personIndex + 1) % POSITIONS_ORDER.length
      const position = POSITIONS_ORDER[positionIndex];
      const client = Object.values(clients).find(client => client.position === position);

      client.connection.send({
        type: ADD_CARDS,
        payload: {
          cards: cards.map(card => ({ ...card, position: position }))
        }
      })
    })
  })

  sendAnnounce(party);


  // send Cards
}

export default Server

function sendAnnounce(party) {
  const positionIndex = (party.round + 1) % POSITIONS_ORDER.length;
  const turnPosition = POSITIONS_ORDER[positionIndex];
  Object.values(clients).forEach(({ connection, position }) => {
    setStep(connection, STEP_ASK_ANNOUNCE, {
      isTurn: position === turnPosition,
      position,
      mat: [],
      positions: {
        N: Object.values(clients).find(client => client.position === 'N').name,
        E: Object.values(clients).find(client => client.position === 'E').name,
        S: Object.values(clients).find(client => client.position === 'S').name,
        W: Object.values(clients).find(client => client.position === 'W').name,
      },
      announce: party.announce
    });
  });
}

function sendWatchCards() {
  const handStartIndex = POSITIONS_ORDER.indexOf(party.handStart);
  const positionIndex = (handStartIndex + party.mat.length) % POSITIONS_ORDER.length;
  const turnPosition = POSITIONS_ORDER[positionIndex];
  Object.values(clients).forEach(({ connection, position, name }) => {
    setStep(connection, STEP_WATCH_CARDS, {
      isTurn: position === turnPosition,
      position,
      mat: party.mat,
      announce: party.announce,
      player: name,
      positions: {
        N: Object.values(clients).find(client => client.position === 'N').name,
        E: Object.values(clients).find(client => client.position === 'E').name,
        S: Object.values(clients).find(client => client.position === 'S').name,
        W: Object.values(clients).find(client => client.position === 'W').name,
      }
    });
  });
}

function sendRoundScore(stacks, scores) {
  Object.values(clients).forEach(({ connection, position }) => {
    setStep(connection, STEP_WATCH_SCORES, {
      position,
      stacks,
      scores,
    });
  });
}
