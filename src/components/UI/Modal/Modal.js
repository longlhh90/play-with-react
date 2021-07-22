import React from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const Modal = (props) => {
    const isModalDisplay = props.show ? [classes.Modal, classes.display].join(' ') : [classes.Modal, classes.hide].join(' ');
    return (
        <React.Fragment>
            <Backdrop show={props.show} bdClicked={props.bdClicked}/>
            <div className={isModalDisplay} >
                {props.children}
            </div>
        </React.Fragment>

    );
};

export default Modal;