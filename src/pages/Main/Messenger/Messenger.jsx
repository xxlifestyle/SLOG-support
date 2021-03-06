import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import  "./Messenger.css"
import sent from "../../../send.svg"
import api from "../../../api";
import user from "../../../user.jpg";
import Empty from "../../../Empty.png"
import Times from "../../../times.svg"
import Check from "../../../check.svg"
import { Button} from "@mui/material";



function Messenger(props) {

    let [messages, setMessages] = useState([])
    let[newMessage, setNewMessage] = useState('')
    const [connected, setConnected] = useState(false)
    let [noData, setNoData] = useState(false)
    let [nextPage, setNextPage] = useState(1)
    const ref = useRef()
    let ws = useRef()


    function fetchMessages() {
        if (noData == null){ return}

        api(nextPage)
            .then( (response)=>{

                setMessages(messages.concat(response.data.results))

                setNextPage(response.data.next)
                if (response.data.next === null){
                    setNoData(true)
                } else {
                    setNoData(false)
                }
            })
    }



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
    async function sendNewMessageEnter(e) {
        if (e.charCode === 13){
            ref.current.value = ""
        await  api.post('chats/helpdesk_messages/',{
            chat:props.chat.id,
            text:newMessage,
        })
            .then((response) =>{
                if (response.status < 203){
                    loadMessages()
                    ref.current.value = ""

                }
            })
        }
    }

    useEffect( ()=>{
        if (props.chat === null){return}
 function fetchData(){
        api('chats/helpdesk_messages/?chat=' + props.chat.id)
          .then( (response)=>{
              setMessages(response.data.results)
                setNextPage(response.data.next)
                if(response.data.next !=null){
                    setNoData(false)
                } else{
                    setNoData(true)
                }
          })
}
fetchData()
    },[props])
    useEffect(()=>{
         console.log('kek')
        console.log(ws)
         if (props.chat === null){return}
         connectToSocket()
         return()=>{
             ws.current.close()
             console.log('closed')

         }
     },[props])

   const connectToSocket = useCallback( () => {

        ws.current =  new WebSocket("ws://dev1.itpw.ru:8004/ws/chats/" + props.chat.id + '/?tk=' + localStorage.getItem('token')); // ?????????????? ws ????????????????????
        ws.current.onopen = (res) => {
            console.log(res)
            setConnected(true)
        };	// callback ???? ?????????? ???????????????? ????????????????????
        ws.current.onmessage =  (mes) => {
            console.log(mes)
            loadMessages()
        }
        ws.current.onerror = (res) =>{
            console.log(res)
           }
        ws.current.onclose = (res) => {
            console.log(res)
            setConnected(false)
            if (res.wasClean !== true) {
                setTimeout(connectToSocket, 3000)
            }
        }
       return()=>{
           ws.current.close()
           console.log('closed')

       }

    }, [props])



  async  function loadMessages() {
    await    api('chats/helpdesk_messages/?chat=' + props.chat.id)
            .then( (response)=>{
                setMessages(response.data.results)
                setNextPage(response.data.next)
                if(response.data.next != null){
                    setNoData(false)
                } else {
                    setNoData(true)
                }
            })
    }




    return (
        <div key={props} className={'mess-block'}>
            {props.chat == null &&
                <img className={'empty-image'} src={Empty} alt=""/>
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
                        ???????????? ??????????????????????:
                        {!connected &&
                            <img title={"??????????????????"} className={'unconnected-icon'} src={Times} alt=""/>
                        }
                        {connected &&
                            <img  title={"????????????????????"} className={'connected-icon'} src={Check} alt=""/>
                        }
                    </div>
                </div>}
            {props.chat != null &&
                <div id={"chatterbox"} className={'mess_main'}>



                    {messages.map(message =>
                        <div key={message.id} title={message._user.name} className={!message.my ? 'message-block' : "message-block__my"}>
                            <div className={!message.my ? 'message' : "message__my"}>
                                <span>{message.text}</span>
                                <sub>{message.created_localize}</sub>
                            </div>
                        </div>
                    )}
                    {!noData &&
                        <Button onClick={fetchMessages} color="success" variant="contained">??????</Button>
                    }




                </div>}

            {props.chat != null &&
                <div className={'mess_footer'}>
                    <textarea ref={ref} onKeyPress={sendNewMessageEnter} onChange={(e)=>{ setNewMessage(e.target.value) }} className={'footer_field'}></textarea>
                    <div className={'send-button'}>
                        <div onClick={sendNewMessage}>
                        <img src={sent} alt=""/></div>
                    </div>
                </div>}

        </div>

    );
}

export default React.memo(Messenger);
