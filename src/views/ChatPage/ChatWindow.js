

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
                ${props.whochat}${isSameAbove?'-same-above':''}${isSameBelow?'-same-below':''} 
                ${props.whochat==='guest-chat'?props.gender:''}`
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
            <p className={`text-box-${props.type}`}><span className='name'>{props.joinName}</span> {props.msg}</p>
    )
}


const ChatWindow =(props) => {
    const [isEmoji,setEmoji]=useState(false)
    const [isTranslate,setTranslate]=useState(false)
    const inputRef = useRef(null)

    const ShowMsg = props.AllMsg.map((msg,index) => {
        if(msg.type.includes('announce')){
            return(
                <Announce
                    type = {msg.type}
                    key = {index}
                    joinName = {msg.user}
                    msg = {msg.msg}
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
                isTranslate={isTranslate}
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
            <h1 className='room-title'>{ props.roomName?'Riêng - '+props.roomName:'Chung - Phòng chờ'}</h1>
            <section onScroll={(e)=>{console.log(e.target.scrollTop,e.target.scrollHeight)}} className='main-box'>
                {/* <TextBox whochat='user-chat'/>
                <TextBox whochat='guest-chat'/>
                <TextBox whochat='guest-chat' isSameUser={true} />
                <Announce joinName='tuantuan2332'></Announce> */}
                {
                    !props.roomName?
                    <Announce 
                    type='announce-welcome' 
                    joinName='Tham gia vào phòng chờ'
                    msg='vui lòng phát biểu văn minh và lịch sự, để tìm bạn chat riêng nhấn vào "Tìm Ngẫu Nhiên"'
                    />:''
                }
                {ShowMsg.slice(0).reverse()}
            </section>
            
            <div  className='chat-input-container'>
                <form onClick={()=>setEmoji(false)} onSubmit={(e)=>{setEmoji(false);props.onTest(e)}}>
                    <input ref={inputRef} onChange={props.inputHandle} value={props.chatInput} type='text' placeholder='Say something here ... '></input>
                </form>
                {props.room.id?
                    <button className={+isTranslate?'chatbtn-active':'chatbtn'}>
                        <span  onClick={props.startVideo} className="material-icons">videocam</span>
                    </button>
                :''}
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