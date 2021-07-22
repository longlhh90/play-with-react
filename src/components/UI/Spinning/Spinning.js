import React from 'react';

import classes from './Spinning.module.css';

const Spinning = (props) => (
  <div className={props.isSmall ? classes.LdsRingSmall : classes.LdsRing}>
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default Spinning;
