import React, {useEffect, useState} from 'react';
import {Container} from "@mui/material";
import api from "../../api";
import "./Main.css"
import {useNavigate} from "react-router-dom";
import user from "../../user.jpg"

const Main = () => {
    const [chatData, setChatData] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        if (localStorage.token == undefined || localStorage.token == null){
            navigate("/login");
        }
        api('chats/helpdesk_chat')
            .then((response)=>{
                setChatData(response.data.results)
            })
    },[])
    return (
<div className={'chat-bg'}>
    <div className={'header-fake'}></div>
        <Container className={'chat-box_container'} maxWidth="xl">

<div className={'chat-block'}>
    {chatData.map(data =>
        <div key={data.id} className={'chat-item'}>
             <div className={'chat-img'}>

                 {data.helpdesk_user_photo != null &&
                     <img src={data.helpdesk_user_photo} alt=""/>
                 }
                 {data.helpdesk_user_photo == null &&
                     <img src={user} alt=""/>
                 }
             </div>
        <div className={'text-form'}>
            <p className={'name-form'}>{data.name}</p>
            <p className={'species-form'}> {data.species}</p>
        </div>

    </div>)}
</div>
            <div className={'mess-block'}>
123
            </div>
        </Container>
</div>
    );
};

export default Main;