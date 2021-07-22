import React from 'react';
import classes from './Button.module.css';

const Button = (props) => {
    return (
        <button
            className={[classes.Button, classes[props.btnType]].join(' ')}
            onClick={props.onclicked}
            disabled={props.disabled}>
            {props.children}
            <i className={props.icon} aria-hidden="true" />
        </button>
    );
};

export default Button;