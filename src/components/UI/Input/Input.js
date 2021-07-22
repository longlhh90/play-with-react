import React from 'react';
import classes from './Input.module.css';

const Input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    switch (props.elementType) {
        case ('input'):
            inputElement = (
                <div className={classes.Input}>
                    <label>{props.label}</label>
                    <input {...props.elementConfig}
                        value={props.value}
                        onChange={props.changed}
                        className={inputClasses.join(' ')} />
                </div>
            );
            break;
        case ('select'):
            inputElement = (
                <div>
                    <label>{props.label}</label>
                    <select
                        value={props.value}
                        onChange={props.changed}>
                        {props.elementConfig.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.displayValue}
                            </option>
                        ))}
                    </select>
                </div>
            );
            break;
        case ('checkbox'):
            inputElement = (
                <div style={{ paddingTop: '20px' }}>
                    <input {...props.elementConfig} type={props.elementType} onChange={props.changed} />
                    <label htmlFor={props.elementConfig.name}>{props.label}</label>
                </div>
            );
            break;
        default:
            inputElement = (
                <div>
                    <label>{props.label}</label>
                    <input {...props.elementConfig}
                        value={props.value}
                        onChange={props.changed}
                        className={inputClasses.join(' ')} />
                </div>
            );
            break;
    }

    return (
        <React.Fragment>
            {inputElement}
        </React.Fragment>
    );

};

export default Input;