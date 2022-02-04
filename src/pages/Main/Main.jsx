import React, {useEffect,useMemo, useRef, useState} from 'react';
import {Button, Container, IconButton} from "@mui/material";
import api from "../../api";
import "./Main.css"
import {useNavigate} from "react-router-dom";
import user from "../../user.jpg"
import Messenger from "./Messenger/Messenger";
import logo from "../../icon.png"
import Bell from "../../bell.svg"
import BellSlash from "../../bell-slash.svg"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LogoutIcon from '@mui/icons-material/Logout';

const Main = () => {
    const [chatData, setChatData] = useState([])
    let [selectedChat, setSelectedChat] = useState(null)
    let [nextPage, setNextPage] = useState(null)
    let [logoutBool, setLogoutBool] = useState(false)
    let [noData, setNoData] = useState(false)
    let [searchHolder, setSearchHolder] = useState('')
    const navigate = useNavigate()
    const ws = useRef()
    const [connected, setConnected] = useState(false)


    useEffect( ()=>{
            if (localStorage.token === undefined || localStorage.token === null) {
                      navigate("/login");
            }
              api('chats/helpdesk_chat/')
                .then((response) => {
                    setChatData(response.data.results)
                    if (response.data.next == null){
                        setNoData(true)
                    } else{
                            setNoData(false)
                        }
                    connectToSocket()
                    setNextPage(response.data.next)
                })
    },[])
    useEffect(()=>{
        if (nextPage === null){
            setNoData(true)
        } else if (nextPage !== null){
            setNoData(false)
        }
    },[nextPage])

    function loadChats() {
        api('chats/helpdesk_chat')
            .then((response)=>{
                setChatData(response.data.results)
            })


    }

    function unsubscribe(id,index){
        api.post('chats/helpdesk_chat/'+ id + '/unsubscribe/')
            .then((response)=>{
                if (response.status <205){
                    let newChatData = [...chatData]
                    newChatData[index].participant = false
                    setChatData(newChatData)
                }
            })
    }
    function subscribe(id, index){
        api.post('chats/helpdesk_chat/'+ id + '/subscribe/')
            .then((response) =>{
        if (response.status <205){
            let newChatData = [...chatData]
            newChatData[index].participant = true
            setChatData(newChatData)
        }
            })
    }

         async function fetchChats(){
            await api(nextPage)
                .then( (response)=>{
                    setNextPage(response.data.next)
                    setChatData(chatData.concat(response.data.results))
                })
        }
    async function search(e){
        if(e.charCode == 13){
        await api('chats/helpdesk_chat/?search=' + searchHolder)
            .then( (response)=>{
                setChatData(response.data.results)
            })} else {return}
    }


    function connectToSocket() {

        ws.current = new WebSocket("ws://dev1.itpw.ru:8004/ws/new_messages/?tk=" + localStorage.getItem('token')); // создаем ws соединение
        ws.current.onopen = () => {

            setConnected(true)
        };
        ws.current.onmessage =  () => {

            loadChats()
        }
        ws.current.onerror = () =>{

            setTimeout(connectToSocket, 5000)
        }
        ws.current.onclose = (res) => {
            setConnected(false)
            if (res.code !== 1000) {
                setTimeout(connectToSocket, 5000)
            }
        }
    }
    return (
<div className={'chat-bg'}>
    {console.log('render')}
    <div className={'header-fake'}>
    </div>
        <Container className={'chat-box_container'} maxWidth="xl">

<div className={'chat-block'}>
    <div className={'mess_header main-header'}>
        <div className={'logo-status'}>
        <img className={'slog-main'} src={logo} alt=""/><p>SLOG SUPPORT</p>
        {connected &&
            <div className={'connections-status-green'}></div>
        }
        {!connected &&
            <div className={'connections-status-red'}></div>
        }
        </div>
        <IconButton onClick={()=>{setLogoutBool(true)}} color="error" aria-label="upload picture" component="span">
            <LogoutIcon />
        </IconButton>
    </div>
    <div>
        <div className={'search-block'}>
            <input onKeyPress={search} placeholder={'Поиск'} type="text" className={"search"}/>
        </div>
    {chatData.map((data, index) =>
        <div   key={data.id} className={'chat-item'}>
             <div onClick={()=>{setSelectedChat(data)}}  className={'chat-img'}>

                 {data.helpdesk_user_photo !== null &&
                     <img src={data.helpdesk_user_photo} alt=""/>
                 }
                 {data.helpdesk_user_photo === null &&
                     <img src={user} alt=""/>
                 }
             </div>
        <div className={'text-form'}>
            <div onClick={()=>{setSelectedChat(data)}} className={'name-zone'}>
            <div  className={'name-form'}>{data.name}</div>
            </div>
            <div   className={'subscribe-btn'}>
                { data.participant === false &&
            <div  onClick={()=>{subscribe(data.id, index)}} className={"bell"}><img src={Bell} alt=""/></div>
                }
                {data.participant === true &&
                    <div onClick={()=>{unsubscribe(data.id, index)}} className={"bell-slash"}><img src={BellSlash} alt=""/></div>
                }
            </div>

            <div onClick={()=>{setSelectedChat(data)}}  className={'unread'} >
            {data.unread_count !== 0 &&
            <div className={'unread-block'} >
                {data.unread_count}
            </div>}
            </div>
        </div>

    </div>)}
        {noData !== true &&
            <Button className={'more-button'} onClick={fetchChats} color="success" variant="contained">Ещё</Button>
        }
    </div>
</div>
<Messenger key={selectedChat} chat={selectedChat} ></Messenger>

            <Dialog
                open={logoutBool}
                onClose={()=>{setLogoutBool(false)}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Выход из системы"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Вы уверены что хотите выйти?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        localStorage.clear()
                    navigate("/login")
                    }} autoFocus>
                        Да
                        </Button>

                    <Button onClick={()=>{setLogoutBool(false)}}>Нет</Button>

                </DialogActions>
            </Dialog>

        </Container>
</div>
    );
};

export default React.memo(Main);