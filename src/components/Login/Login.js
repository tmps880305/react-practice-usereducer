import React, {useState, useEffect, useReducer, useContext} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input'
import AuthContext from '../context/auth-context'

const emailReducer = (state, action) => {
    // We use useReducer to go through two states manage in one func here

    // Function 1: This function itself, read state after user input

    // Function 2 (condition 1 or 2): use previous read state to check validation
    // Condition 1: reading the user input state onInput
    if (action.type === 'USER_INPUT') {
        // action.type is needed because we want to manage two states here in one func
        // action.val is the user input we set in the ChangeHandler
        return {value: action.value, isValid: action.value.includes('@')};
    }
    // Condition 2: reading the user input state onBlur (lose focus)
    if (action.type === 'INPUT_BLUR') {
        return {value: state.value, isValid: state.value.includes('@')};
    }

    return {value: '', isValid: false};
};

const passwordReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return {value: action.value, isValid: action.value.trim().length > 6};
    }
    if (action.type === 'INPUT_BLUR') {
        return {value: state.value, isValid: state.value.trim().length > 6};
    }

    return {value: '', isValid: false};
};


const Login = (props) => {
    // const [enteredEmail, setEnteredEmail] = useState('');
    // const [emailIsValid, setEmailIsValid] = useState();
    // const [enteredPassword, setEnteredPassword] = useState('');
    // const [passwordIsValid, setPasswordIsValid] = useState();
    const [formIsValid, setFormIsValid] = useState(false);

    const [emailState, dispatchEmail] = useReducer(emailReducer, {value: '', isValid: null});
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: '', isValid: null}); // set isValid null to prevent the invalid css show up on start

    const authCtx = useContext(AuthContext);


    // useEffect(() => {
    //     console.log('EFFECT RUNNING');
    //
    //     return () => {
    //         console.log('EFFECT CLEANUP');
    //     };
    // }, []);


    // To make useEffect work only when the validation changed (but not every time when input)
    const {isValid: emailIsValid} = emailState;
    const {isValid: passwordIsValid} = passwordState;


    useEffect(() => {
        const identifier = setTimeout(() => {
            console.log('Checking form validity!');
            setFormIsValid(
                emailState.isValid && passwordState.isValid
            );
        }, 500);

        return () => {
            console.log('CLEANUP');
            clearTimeout(identifier);
        };
    }, [emailIsValid, passwordIsValid]);

    const emailChangeHandler = (event) => {
        // setEnteredEmail(event.target.value);
        dispatchEmail({type: 'USER_INPUT', value: event.target.value});

        // setFormIsValid(
        //     event.target.value.includes('@') && passwordState.value.trim().length > 6
        // );
    };

    const passwordChangeHandler = (event) => {
        // setEnteredPassword(event.target.value);
        dispatchPassword({type: 'USER_INPUT', value: event.target.value});

        // setFormIsValid(
        //     emailState.value.includes('@') && event.target.value.trim().length > 6
        // );
    };

    const validateEmailHandler = () => {
        // setEmailIsValid(emailState.value.includes('@'));
        dispatchEmail({type: 'INPUT_BLUR'});
    };

    const validatePasswordHandler = () => {
        // setPasswordIsValid(passwordState.value.trim().length > 6);
        dispatchPassword({type: 'INPUT_BLUR'});
    };

    const submitHandler = (event) => {
        event.preventDefault();
        authCtx.onLogin(emailState.value, passwordState.value);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <Input
                    id='email'
                    type='email'
                    label='E-Mail'
                    isValid={emailIsValid}
                    value={emailState.value}
                    onChange={emailChangeHandler}
                    onBlur={validateEmailHandler}
                />

                <Input
                    id='password'
                    type='password'
                    label='Password'
                    isValid={passwordIsValid}
                    value={passwordState.value}
                    onChange={passwordChangeHandler}
                    onBlur={validatePasswordHandler}
                />

                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn} disabled={!formIsValid}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
