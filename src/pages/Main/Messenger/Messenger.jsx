import React, {useEffect, useState} from "react";
import styles from "./Messenger.css"
import sent from "../../../send.svg"
import api from "../../../api";
import user from "../../../user.jpg";
import Empty from "../../../Empty.png"




function Messenger(props) {

    let [messages, setMessages] = useState([])
    let[newMessage, setNewMessage] = useState('')

   async function sendNewMessage() {
      await  api.post('chats/helpdesk_messages/',{
            chat:props.chat.id,
            text:newMessage,
        })
            .then((response) =>{
            })
    }

    useEffect(async ()=>{
        console.log(props)
      await  api('http://dev1.itpw.ru:8004/chats/helpdesk_messages/?chat=' + props.chat.id)
          .then( (response)=>{
              setMessages(response.data.results.reverse())
          })
    },[props])


    return (

        <div className={'mess-block'}>
            {props.chat == null &&
                <img class={'empty-image'} src={Empty} alt=""/>
            }
            {props.chat != null &&
                <div className={'mess_header'}>
                    <div className={'mess-header_photo'}>
                        {props.chat.helpdesk_user_photo != null &&
                            <img src={props.chat.helpdesk_user_photo} alt=""/>
                        }
                        {props.chat.helpdesk_user_photo == null &&
                            <img src={user} alt=""/>
                        }
                    </div>
                    <span>{props.chat.name}</span>
                </div>}
            {props.chat != null &&
                <div className={'mess_main'}>

                    {messages.map(message =>
                        <div key={message.id} className={!message.my ? 'message-block' : "message-block__my"}>
                            <div className={!message.my ? 'message' : "message__my"}>
                                {message.my}
                            {message.text}
                            </div>
                        </div>
                    )}





                </div>}
            {props.chat != null &&
                <div className={'mess_footer'}>
                    <textarea onChange={(e)=>{ setNewMessage(e.target.value) }} className={'footer_field'}></textarea>
                    <div className={'send-button'}>
                        <div onClick={sendNewMessage}>
                        <img   src={sent} alt=""/></div>
                    </div>
                </div>}

        </div>

    );
}

export default Messenger;
