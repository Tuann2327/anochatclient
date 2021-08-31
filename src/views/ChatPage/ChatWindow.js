

import { useState, useRef } from 'react';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import emoji from 'emoji-mart/dist-es/components/emoji/emoji';

const TextBox = (props) =>{
    const isSameAbove = props.isSameAbove;
    const isSameBelow = props.isSameBelow;
    const isShowAvt = props.whochat!=='user-chat' && !isSameBelow
    return(
        <div className='text-box-container'>
            {props.whochat!=='user-chat' ?
                <div className='avt-wrapper'>
                  {isShowAvt? <img src={props.ENDPOINT+`/api/accounts/avt/${props.gender}/${props.user}`}></img>:''} 
                </div>:''
            }
            
            <div className={
                `text-box 
                ${props.whochat}${isSameAbove?'-same-above':''}${isSameBelow?'-same-below':''}`
                }>
                <h2 className={`chat-name ${isSameAbove?'hide':''}`}>
                    {props.user}
                </h2>
                <p className='text-mess'>{props.msg}</p>
            </div>
        </div>
    )
}

const Announce = (props) =>{
    return(
        <p className='text-box-annouce'><span className='name'>{props.joinName}</span> {props.msg}</p>
    )
}


const ChatWindow =(props) => {
    const [isEmoji,setEmoji]=useState(false)
    const inputRef = useRef(null)

    const ShowMsg = props.AllMsg.map((msg,index) => {
        if(msg.type==='announce'){
            return(
                <Announce
                    key = {index}
                    joinName = {msg.user}
                    msg={msg.msg}
                />
            )
        }

        let isSameAbove = false;
        let isSameBelow = false;
        if( props.AllMsg[index-1] && props.AllMsg[index-1].type === 'chat' && msg.user === props.AllMsg[index-1].user) isSameAbove =true;
        if(props.AllMsg[index+1] && msg.user === props.AllMsg[index+1].user) isSameBelow =true;
        return(
            <TextBox 
                key = {index}
                whochat={msg.user === props.user.username?'user-chat':'guest-chat'}
                msg = {msg.msg}
                user = {msg.user}
                gender = {msg.gender}
                isSameAbove = {isSameAbove}
                isSameBelow = {isSameBelow}
                ENDPOINT = {props.ENDPOINT}
            />
        )
    })

    //emojimodal

    //emojimodal

    return(
        <div className='main-box-container'>
            <h1 className='room-title'>{ props.roomName?props.roomName:'AnoChat - General Room'}</h1>
            <section onScroll={(e)=>{console.log(e.target.scrollTop,e.target.scrollHeight)}} className='main-box'>
                {/* <TextBox whochat='user-chat'/>
                <TextBox whochat='guest-chat'/>
                <TextBox whochat='guest-chat' isSameUser={true} />
                <Announce joinName='tuantuan2332'></Announce> */}
                {ShowMsg.slice(0).reverse()}
            </section>
            
            <div  className='chat-input-container'>
                <form onClick={()=>setEmoji(false)} onSubmit={props.onTest}>
                    <input ref={inputRef} onChange={props.inputHandle} value={props.chatInput} type='text' placeholder='Say something here ... '></input>
                </form>
                <button className='chatbtn'>
                    <span  onClick={()=>{setEmoji(!isEmoji)}} className="material-icons">insert_emoticon</span>
                    <div style={{display: isEmoji?'':'none'}} className='emoji-modal'>
                        <Picker set='twitter' onClick={(emoji)=>{props.addEmoji(emoji.native);inputRef.current.focus()}} showSkinTones={false} perLine={7} sheetSize={32} title='Emoji' showPreview={false} />
                    </div>
                </button>
                {/* {props.chatInput !== '' ? <button className='chat-send'>Send</button> : '' } */}
            </div>
        </div>
    )
}

export default ChatWindow