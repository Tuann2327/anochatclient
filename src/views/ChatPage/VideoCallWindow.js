import { useRef, useEffect } from "react"

const StreamVideo = (props)=>{
    const videoRef = useRef(null)
    useEffect(()=>{
        videoRef.current.srcObject = props.stream;
    },[])
    return <video autoPlay muted playsInline ref={videoRef}/>
}

const VideoCallWindow = (props) =>{ 

    const getVideoList = props.streamList.map((stream,index) =>{
        return <StreamVideo stream={stream} key={index}/>
    })

    return(
        <div onClick={props.startVideo} className='video-box-container'>
            <div className='video-list'>
                {getVideoList}
            </div>
        </div>
    )
}

export default VideoCallWindow