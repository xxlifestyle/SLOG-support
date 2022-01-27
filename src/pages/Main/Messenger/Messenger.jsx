import React, {useEffect, useRef, useState} from "react";
import  "./Messenger.css"
import sent from "../../../send.svg"
import api from "../../../api";
import user from "../../../user.jpg";
import Empty from "../../../Empty.png"
import Times from "../../../times.svg"
import Check from "../../../check.svg"




function Messenger(props) {

    let [messages, setMessages] = useState([])
    let[newMessage, setNewMessage] = useState('')
    const [connected, setConnected] = useState(false)
    const ref = useRef()
    const ws = useRef()

   async function sendNewMessage() {
        ref.current.value = ""

       await  api.post('chats/helpdesk_messages/',{
            chat:props.chat.id,
            text:newMessage,
        })
            .then((response) =>{
                if (response.status < 203){
                    loadMessages()


                }
            })
    }

    useEffect(async ()=>{
      await  api('http://dev1.itpw.ru:8004/chats/helpdesk_messages/?chat=' + props.chat.id)
          .then( (response)=>{

              setMessages(response.data.results)

          })

    },[props])
     useEffect(  async  ()=>{
         if (connected == true){
             ws.current.close(1000,"Поддержка сменила чат")
             setConnected(false)
         }
         await api.post('http://dev1.itpw.ru:8004/chats/helpdesk_chat/'+ props.chat.id +'/subscribe/')
         ws.current = new WebSocket("ws://dev1.itpw.ru:8004/ws/chats/" + props.chat.id + '/?tk=' + localStorage.getItem('token')); // создаем ws соединение
         ws.current.onopen = () => {
             console.log("Соединение открыто")
             setConnected(true)
         };	// callback на ивент открытия соединения
         ws.current.onmessage = () => console.log('Новое сообщение')
         ws.current.onerror = () =>{
             setTimeout(connectToSocket, 5000)
             console.log('error')}
         ws.current.onclose = () => {
             console.log("Соединение закрыто")
         setConnected(false)
             setTimeout(connectToSocket, 5000)
         }


     },[props])

    function connectToSocket() {
        if (connected == true){
            ws.current.close(1000,"Поддержка сменила чат")
            setConnected(false)
        }
        ws.current = new WebSocket("ws://dev1.itpw.ru:8004/ws/chats/" + props.chat.id + '/?tk=' + localStorage.getItem('token')); // создаем ws соединение
        ws.current.onopen = () => {
            console.log("Соединение открыто")
            setConnected(true)
        };	// callback на ивент открытия соединения
        ws.current.onmessage = () => console.log('Новое сообщение')
        ws.current.onerror = () =>{
            setTimeout(connectToSocket, 5000)
            console.log('error')}
        ws.current.onclose = () => {
            console.log("Соединение закрыто")
            setConnected(false)
            setTimeout(connectToSocket, 5000)
        }
    }



  async  function loadMessages() {
    await    api('http://dev1.itpw.ru:8004/chats/helpdesk_messages/?chat=' + props.chat.id)
            .then( (response)=>{
                setMessages(response.data.results)
            })
    }




    return (

        <div className={'mess-block'}>
            {props.chat == null &&
                <img class={'empty-image'} src={Empty} alt=""/>
            }
            {props.chat != null &&
                <div className={'mess_header mess-header_status'}>
                    <div className={'header-info'}>
                    <div className={'mess-header_photo'}>
                        {props.chat.helpdesk_user_photo != null &&
                            <img src={props.chat.helpdesk_user_photo} alt=""/>
                        }
                        {props.chat.helpdesk_user_photo == null &&
                            <img src={user} alt=""/>
                        }
                    </div>
                    <span>{props.chat.name}</span></div>
                    <div className={'connection-icons'}>
                        Статус подключения:
                        {!connected &&
                            <img title={"Отключено"} className={'unconnected-icon'} src={Times} alt=""/>
                        }
                        {connected &&
                            <img  title={"Подключено"} className={'connected-icon'} src={Check} alt=""/>
                        }
                    </div>
                </div>}
            {props.chat != null &&
                <div id={"chatterbox"} className={'mess_main'}>

                    {messages.map(message =>
                        <div title={message._user.name} key={message.id} className={!message.my ? 'message-block' : "message-block__my"}>
                            <div className={!message.my ? 'message' : "message__my"}>
                                <span>{message.text}</span>
                                <sub>{message.created_localize}</sub>
                            </div>
                        </div>
                    )}





                </div>}
            {props.chat != null &&
                <div className={'mess_footer'}>
                    <textarea ref={ref} onChange={(e)=>{ setNewMessage(e.target.value) }} className={'footer_field'}></textarea>
                    <div className={'send-button'}>
                        <div onClick={sendNewMessage}>
                        <img src={sent} alt=""/></div>
                    </div>
                </div>}

        </div>

    );
}

export default Messenger;
