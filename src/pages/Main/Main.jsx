import React, {useEffect, useState} from 'react';
import {Container} from "@mui/material";
import api from "../../api";
import "./Main.css"

const Main = () => {
    const [chatData, setChatData] = useState([])

    useEffect(()=>{
        api('chats/helpdesk_chat')
            .then((response)=>{
                setChatData(response.data.results)
            })
    },[])
    return (
<div className={'chat-bg'}>
    <div className={'header-fake'}></div>
        <Container className={'chat-box_container'} maxWidth="xl">

<div>
    {chatData.map(data => <div key={data.id} className={'char-item'}>
        <div className={'img-form'}>
            <img src={data.image} alt=""/>
        </div>
        <div className={'text-form'}>
            <p className={'name-form'}>{data.name}</p>
            <p className={'species-form'}> {data.species}</p>
        </div>

    </div>)}
</div>
        </Container>
</div>
    );
};

export default Main;