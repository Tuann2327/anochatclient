import { useState, useRef, useEffect } from "react"
import Modal from 'react-modal';
import axios from 'axios'
import Cookies, { set } from 'js-cookie'
import QueryString from 'qs'
import {useHistory} from 'react-router-dom'
import ChatWindow from "./ChatWindow"
import "./ChatPage.style.scss"
import { io } from "socket.io-client";
import InfoWindow from "./InfoWindow"
import Peer from 'peerjs';
import FormData from "form-data";


import malegender from '../../assets/male-gender.svg'
import femalegender from '../../assets/female-gender.svg'
import arrowr from '../../assets/nav-arrowr.svg'
import arrowl from '../../assets/nav-arrowl.svg'
import VideoCallWindow from "./VideoCallWindow";
// handle the event sent with socket.emit()
// socket.on("greetings", (elem1, elem2, elem3) => {
//   console.log(elem1, elem2, elem3);
// });

const ChatPage = (props)=>{

    const [isAuth,setIsAuth] = useState(false)
    const [room,setRoom] = useState({})
    const [modalIsOpen, setIsOpen] = useState(false);
    const [userdata,setUserdata] = useState({})
    const [chatInput,setChatInput] = useState('')
    const [allMsg,setAllMsg] = useState([])
    const [newMsg, setNewMgs]= useState({})
    const [onlineList, setOnlineList ] = useState([])
    const [gender, setGender] = useState('none')
    const [age, setAge] = useState(2000)


    //matchmaking

    const [isMatching, setMatching] = useState(false)

    //video-chat
    const [isVideoChat,setVideoChat] = useState(false)
    const [streamList, setStreamList] = useState([])
    const [newVideo,setNewVideo] = useState()

    //video-chat
    const history = useHistory();
    const socket = useRef();
    const myPeer = useRef();
    const inputAvt = useRef();


    useEffect(() => {
        const getData = async ()=>{
            const data = QueryString.stringify({
                token: Cookies.get('access_token')
            })
            const isMatch = await axios.post(props.ENDPOINT+'/api/auth',data,{ headers: { "Content-Type": "application/x-www-form-urlencoded" } })
            if(!isMatch.data.isFound){
                history.push('/login')
            }else{
                await setIsAuth(isMatch.data.isFound)
                await setUserdata(isMatch.data.accountInfo)
                await setGender(isMatch.data.accountInfo.gender)
                await setAge(isMatch.data.accountInfo.age)
                
                socket.current = io(props.ENDPOINT);
                socket.current.on("connect", () => {
                    socket.current.emit('onOnline',{id:isMatch.data.accountInfo.id,username:isMatch.data.accountInfo.username,gender:isMatch.data.accountInfo.gender})
                })
                socket.current.on("onBackChat", (data) => {
                    setNewMgs(data)
                })
                socket.current.on("foundMatching",(data)=>{
                    console.log(data)
                    socket.current.emit('joinRoomID',{id:data.roomid,user:data.user})
                    setMatching(false)
                    setRoom({id:data.roomid,name:data.user})
                    setAllMsg([])
                })

                if(isMatch.data.accountInfo.gender==='none') setIsOpen(true);
            }
        };
        getData()
        return () => {
            socket.current && socket.current.disconnect();
        }
    }, [])
    
    useEffect(()=>{
        if(newMsg.user){
            const currentmsgs = [...allMsg,newMsg]
            setAllMsg(currentmsgs)
            if(newMsg.onlineUser) setOnlineList(newMsg.onlineUser)
        }
    },[newMsg])
    
    
    const chatInputHandle = (e)=>{
        setChatInput(e.target.value)
    }

    const addEmoji = (emoji)=>{
        setChatInput(chatInput+emoji)
    }

    const onSendChat = (e)=>{
        e.preventDefault();
        if(chatInput.trim()==='') return
        socket.current.emit('onChat',{type:'chat',user:userdata.username,msg: chatInput.trim(),gender:userdata.gender,roomid: room.id})
        setChatInput('')
    }

    
    const onAvtClick = ()=>{
        inputAvt.current.click();
    }

    const onAvtSubmit = async (e)=>{
        const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        const imgfile = e.target.files[0]
        if(acceptedImageTypes.includes(imgfile.type)){
            const formData = new FormData();
            formData.append("file", imgfile,userdata.id+".jpg")
            try{
                const result = await axios.post(props.ENDPOINT+'/api/accounts/setavt/'+userdata.username, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setNewMgs({type:'announce',user:userdata.username,msg:'Đã đổi thành công ảnh đại diện, Refresh lại page để xác nhận thay đổi'})
            }catch(e){
                console.log(e)
            }
        }else {
            console.log('not invalid file')
        }
    }

    //Matching
    const onMatching=()=>{
        if(room.id) {
            socket.current.emit('leaveRoomID',room.id)
            setAllMsg([])
            setRoom({})
            return
        }
        if(!isMatching) socket.current.emit('joinMatching',userdata)
        else socket.current.emit('leaveMatching',userdata)
        setMatching(!isMatching)
    }


    //modal
    Modal.setAppElement('#root');

    const onSignOut = ()=>{
        console.log('haha')
        Cookies.remove('access_token',{ path: '' })
        window.location.reload(); 
    }

    const onGenderClick = (getgender)=>{
        setGender(getgender);
    }
    
    const onAgeClick = (getage)=>{
        setAge( parseInt(age)+getage);
    }

    const openUpdate = ()=>{
        setIsOpen(true);
    }


    
    const closeModal = async ()=>{
        const data = QueryString.stringify({
            'id':userdata.id,
            'gender': gender,
            'age': age
        })
        await axios.post(props.ENDPOINT+'/api/accounts/gender',data,{ headers: { "Content-Type": "application/x-www-form-urlencoded" } })
        setIsOpen(false);
    }

    //video-chat - start

    const onStartVideo = async () =>{
        if(isVideoChat) return
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            setVideoChat(true)
            const tempList = [...streamList]
            tempList.push(stream)
            setStreamList(tempList)
            
            myPeer.current = new Peer(undefined, {
                host: 'localhost',
                port: '8080',
                path: '/peerjs'
            })
            myPeer.current.on('open',id => {
                console.log(id)
                socket.current.emit("joinVideoChat",id)
            })

            myPeer.current.on('call', call => {
                console.log('someone is calling you')
                call.answer(stream)
                call.on('stream', callerStream=>{
                    setNewVideo(callerStream)
                })
                
            })

            socket.current.on("joinVideoChat",(id) => {
                console.log(id)
                console.log(stream)
                connectToUser(id,stream)
            })

            socket.current.on("videoClose",(id) => {
                streamList.slice(streamList.findIndex(stream => stream.id === id.id),1)
            })
        }).catch(e=>{
            return
        })
    }

    const connectToUser = (id,stream) =>{
        const call = myPeer.current.call(id,stream)
        call.on('stream', userStream =>{
            console.log('some one is respone to your call')
            console.log(userStream.id)
            setNewVideo(userStream)
        })
        call.on('close',()=>{
            console.log('someoneclose')
        })
    }

    
    useEffect(()=>{
        if(newVideo){
            const newList = [...streamList,newVideo]
            setStreamList(newList)
        }
    },[newVideo])
    

    // video chat - end


    return(
        <main>
            
            <input onChange={onAvtSubmit} type='file' id='file' ref={inputAvt} style={{display: 'none'}}/>
            {/* <VideoCallWindow startVideo={onStartVideo} streamList={streamList}/> */}
            <ChatWindow addEmoji={addEmoji} ENDPOINT={props.ENDPOINT} roomName={room.name} onTest = {onSendChat} AllMsg={allMsg} user={userdata} inputHandle = {chatInputHandle} chatInput = {chatInput}/>
            <InfoWindow 
                ENDPOINT={props.ENDPOINT} 
                user={userdata} 
                onsignout={onSignOut} 
                onavtclick={onAvtClick}
                updateinfo={openUpdate} 
                ismatching={isMatching}
                onMatching={onMatching}
                room={room}
                OnlineList={onlineList}
            />
            <Modal
                className='gender-modal'
                isOpen={modalIsOpen}
                contentLabel="Gender choice"
            >
                <div 
                onClick={()=>{onGenderClick('male')}} 
                className={`gender-card-male${gender==='male'?'choice':''}`}>
                    <img className='gender-icon' src={malegender}></img>
                </div>
                <div 
                onClick={()=>{onGenderClick('female')}} 
                className={`gender-card-female${gender==='female'?'choice':''}`}>
                    <img className='gender-icon' src={femalegender}></img>
                </div>
                
                <div className='age-card'>
                    <button onClick={()=>{onAgeClick(-1)}} className='arrow'><img src={arrowl}/></button>
                    <h2>{age}</h2>
                    <button onClick={()=>{onAgeClick(1)}} className='arrow'><img src={arrowr}/></button>
                </div>
                {gender !== 'none'?<button onClick={closeModal}>Continue</button>:''} 
            </Modal>
        </main>
    )
}
export default ChatPage