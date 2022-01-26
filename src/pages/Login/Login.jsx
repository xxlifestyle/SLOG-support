import React, {useEffect, useState} from "react";
import styles from "./Login.css"
import {Alert, Button, Snackbar, styled, TextField} from "@mui/material";
import icon from "../../icon.png"
import API from "../../api";
import { useNavigate } from "react-router-dom";




function Login() {
    let [loginHolder, setLoginHolder] = useState('')
    let [passwordHolder, setPasswordHolder] = useState('')
    let [codeSendHolder, setCodeSendHolder] = useState(false)
    let [snackbarStatus, setSnackbarStatus] = useState(false)
    const navigate = useNavigate()


    useEffect( ()=>{
        if (localStorage.token !== undefined && localStorage.token !== null){
          navigate("/");
        }
    })

    const handleClick = () => {
        setSnackbarStatus(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarStatus(false);
    };


  async  function login() {
        if (codeSendHolder == false) {
         await   API.post('accounts/auth/admin/admin/', {
                phone: loginHolder,
                otc: passwordHolder
            })
                .then((response) => {
                    setCodeSendHolder(true)
                    setSnackbarStatus(true)
                })
        } else {
         await   API.post('accounts/auth/admin/admin/', {
                phone: loginHolder,
                otc: passwordHolder
            })
                .then(async (response) => {
                    await window.localStorage.setItem('token', response.data.token);
                    if (localStorage.token != null && localStorage.token != undefined) {
                        navigate("/");
                    } else {
                        navigate("/login");
                    }
                })
             .catch((e)=>{
                 console.log(e)
                 return
             })
        }
    }



    return (
        <div className="app-login">
            <div className={"login-form"}>
                <img className={'icon-login'} src={icon}alt="Логин"/>


                <TextField
                    onChange={(e)=>{ setLoginHolder(e.target.value ) }}
                    className={'form-input'}
                    required
                    id="outlined-required"
                    label="Номер телефона"
                    size="small"
                    disabled={codeSendHolder == true}

                />
                <TextField
                    onChange={(e)=>{ setPasswordHolder(e.target.value) }}
                    className={'form-input'}
                    required
                    id="outlined-required"
                    label="Пароль"
                    disabled={codeSendHolder == false}
                    size="small"

                />

                <Button onClick={login} className={'form-btn'} variant="contained">Send code</Button>

            </div>
            <Snackbar  open={snackbarStatus} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Сообщение отправлено!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Login;
