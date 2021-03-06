import React, { useState, useCallback, useEffect } from 'react';
import styles from './styles.module.css'
import { CLIENT_ANNOUNCE, CLIENT_VALIDATE_ANNOUNCE } from '../../Constants';
import { Button } from '../Button';
import { Box } from '../Box';
import { PlayerPositions } from '../PlayerPositions';
import { TurnIndicator } from '../TurnIndicator';

const Label = ({ value, setValue, currentValue, children }) => {
  const onChange = useCallback((event) => setValue(value), [setValue, value])
  const isChecked = value === currentValue
  return <label className={`${styles.label} ${isChecked && styles.checked}`}> <input checked={isChecked} type="radio" name="amount" value={value} onChange={onChange}></input>{children || value}</label>
}

export const RenderAnnoucementTable = ({ send, step = {} }) => {
  const { announce: { value = 80, color = '', player= ''} = {}} = step;
  const [localCount, setLocalCount] = useState(value);
  const [localColor, setLocalColor] = useState(color);
  useEffect(() => {
    setLocalCount(value)
  }, [value])

  useEffect(() => {
    setLocalColor(color)
  }, [color])

  const envoyer = useCallback(() => {
    if(!localCount || (color && !(localCount>value))) {
      alert('Vous devez monter ou passer');
      return;
    }
    if(!localColor){
      alert('Vous devez definir une couleur');
      return;
    }
    send({ 
      type: CLIENT_ANNOUNCE,
      announce: {
        value: localCount,
        color: localColor,
      }
    });
  },[localCount, color, value, localColor, send])

  const passer = useCallback(() => {
    send({ type: CLIENT_VALIDATE_ANNOUNCE })
  }, [send])
  return <Box className={styles.table} style={{ position: 'relative'}}>
      <div  className={styles.section}>
      <div className={styles.labelLine}>
     <Label name="count" value={80} currentValue={localCount} setValue={setLocalCount} />
     <Label name="count" value={90} currentValue={localCount} setValue={setLocalCount}/>
     <Label name="count" value={100} currentValue={localCount} setValue={setLocalCount}/>
  </div>
    <div className={styles.labelLine}>
    <Label name="count" value={110} currentValue={localCount} setValue={setLocalCount}/>
    <Label name="count" value={120} currentValue={localCount} setValue={setLocalCount}/>
    <Label name="count" value={130} currentValue={localCount} setValue={setLocalCount}/>
    </div>
    <div className={styles.labelLine}>
    <Label name="count" value={140} currentValue={localCount} setValue={setLocalCount}/>
    <Label name="count" value={150} currentValue={localCount} setValue={setLocalCount}/>
    <Label name="count" value={160} currentValue={localCount} setValue={setLocalCount}/>
    </div>
    </div>
    <div className={styles.section}>
      <div className={styles.labelLine}>
        <Label name="color" value={'hearts'} currentValue={localColor} setValue={setLocalColor}><Suit color="red">️️♥️</Suit></Label>
        <Label name="count" value={'clubs'} currentValue={localColor} setValue={setLocalColor}><Suit color="black">♣</Suit></Label>
      </div>  <div className={styles.labelLine}>
        <Label name="count" value={'diamonds'} currentValue={localColor} setValue={setLocalColor}><Suit color="red">♦️</Suit></Label>
        <Label name="count" value={'spades'} currentValue={localColor} setValue={setLocalColor}><Suit color="black">♠️</Suit></Label>
    </div>
    <div style={{paddingTop: 8}}>
      <div>{player && `Annonce de ${player}`}</div>
      <Button yellow onClick={envoyer}>Parler</Button><br />
      <Button yellow onClick={passer}>Passer</Button>
    </div>
    </div>
    <PlayerPositions step={step} />
    <TurnIndicator step={step} />
  </Box >;
};

const Suit = ({ children , color }) => <div className={`${styles.suit} ${styles[color]}`}>{children}</div>
