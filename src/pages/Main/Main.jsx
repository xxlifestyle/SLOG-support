import React, {useEffect, useState} from 'react';
import {Container} from "@mui/material";
import api from "../../api";
import "./Main.css"
import {useNavigate} from "react-router-dom";
import user from "../../user.jpg"
import Messenger from "./Messenger/Messenger";
import logo from "../../icon.png"
import Bell from "../../bell.svg"
import BellSlash from "../../bell-slash.svg"

const Main = () => {
    const [chatData, setChatData] = useState([])
    let [selectedChat, setSelectedChat] = useState(null)
    const navigate = useNavigate()

    useEffect(async ()=>{
        if (localStorage.token == undefined || localStorage.token == null){
        await    navigate("/login");
        }
        api('chats/helpdesk_chat')
            .then((response)=>{
                setChatData(response.data.results)
            })
    },[])
    return (
<div className={'chat-bg'}>
    <div className={'header-fake'}>
    </div>
        <Container className={'chat-box_container'} maxWidth="xl">

<div className={'chat-block'}>
    <div className={'mess_header main-header'}>
        <img class={'slog-main'} src={logo} alt=""/><p>SLOG SUPPORT</p>
    </div>
    <div>
    {chatData.map(data =>
        <div onClick={()=>{setSelectedChat(data)}} key={data.id} className={'chat-item'}>
             <div className={'chat-img'}>

                 {data.helpdesk_user_photo != null &&
                     <img src={data.helpdesk_user_photo} alt=""/>
                 }
                 {data.helpdesk_user_photo == null &&
                     <img src={user} alt=""/>
                 }
             </div>
        <div className={'text-form'}>
            <div className={'name-form'}>{data.name}</div>

            <div className={'subscribe-btn'}>
                { data.is_active == false &&
            <div className={"bell"}><img src={Bell} alt=""/></div>
                }
                {data.is_active == true &&
                    <div className={"bell-slash"}><img src={BellSlash} alt=""/></div>
                }
            </div>
            <div className={'unread'} >
            {data.unread_count != 0 &&
            <div className={'undread-block'} >
                {data.unread_count}
            </div>}
            </div>
        </div>

    </div>)}
    </div>
</div>
<Messenger chat={selectedChat} ></Messenger>
        </Container>
</div>
    );
};

export default Main;