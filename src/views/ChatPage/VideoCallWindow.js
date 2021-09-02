import { useRef, useEffect } from "react"

const StreamVideo = (props)=>{
    const videoRef = useRef(null)
    useEffect(()=>{
        videoRef.current.srcObject = props.stream;
    },[])
    return <video autoPlay muted={props.isMute} playsInline ref={videoRef}/>
}

const VideoCallWindow = (props) =>{ 

    return(
        <div onClick={props.startVideo} className='video-box-container'>
            <div className='video-list'>
                {props.yourStream?<StreamVideo stream={props.yourStream} isMute={false}/>:''}
                {props.isVideoChat?<StreamVideo stream={props.myStream} isMute={true}/>:''}
            </div>
        </div>
    )
}

export default VideoCallWindow