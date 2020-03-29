import React from 'react';
import styles from './style.module.css'

export const Button = ({yellow, ...props}) => <button {...props} className={`${styles.button} ${yellow && styles.yellow}`} />;

