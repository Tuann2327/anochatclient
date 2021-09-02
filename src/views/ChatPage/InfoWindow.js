
import starpoint from '../../assets/star.svg'
import loading from '../../assets/loading.svg'

const InfoWindow = (props)=>{

    
    
    const OnlineList = props.OnlineList.map((user,index) => {
        return(
            <div className='online-list-card' key={index}>
                <div className='avt-wrapper'><img src={props.ENDPOINT+`/api/accounts/avt/${user.data.gender}/${user.data.username}`}></img></div>
                <p className='username'>{user.data.username}</p>
            </div>
        )
    })

    const getFindRandomText = ()=>{
        if(props.ismatching) return 'Đang Tìm'
        if(props.room.id) return 'Thoát Trò Truyện' 
        return 'Tìm Ngẫu Nhiên'
    }

    return(
        <div className='info-box-container'>
            <div className='user-info-card'>
                <div className='user-info'>
                    <div onClick={props.onavtclick} className='avt-wrapper'>
                        <img src={props.ENDPOINT+`/api/accounts/avt/${props.user.gender}/${props.user.username}`}></img>
                    </div>
                    <div className='info-wrapper'>
                        <h2 className='username'>{props.user.username}</h2>
                        <div className='star-point'><span>123.123</span><img className='star' src={starpoint}></img></div>
                    </div>
                    
                </div>
                <button onClick={props.updateinfo} className='info'>
                    
                    <span class="material-icons">
                        settings
                    </span>
                    <span className='text'>Cài Đặt</span>

                </button>
                <button onClick={props.onMatching} className='find-random'>
                    <span>{getFindRandomText()}</span>{props.ismatching?<img width='50px' src={loading}/>:''}
                </button>
                <button onClick={props.onsignout} className='signout'>
                    <span class="material-icons">
                        logout
                    </span>
                    <span className='text'>Đăng Xuất</span>
                </button>
            </div>
            <div className='online-info-card'>
                <h2 className='online-info-title'>ONLINE USER - <span className='number-online'>{props.OnlineList.length}</span></h2>
                <div className='online-list'> 
                    {OnlineList}
                </div>
            </div>
        </div>
    )
}

export default InfoWindow