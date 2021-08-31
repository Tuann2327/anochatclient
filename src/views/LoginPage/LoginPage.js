import './LoginPage.style.scss'
import welcomeimg from '../../assets/LoginChat.svg'
import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
import Cookies from 'js-cookie'

const LoginPage = (props)=>{

    const SetAuth = (token)=>{
        const expires = (60 * 60) * 1000
        const inOneHour = new Date(new Date().getTime() + expires)
        Cookies.set('access_token',token, { expires: inOneHour })
        console.log(Cookies.get('access_token'))
    }

    return(
        <div className='login-page-container'>
            {props.isLogin === '0' ? <RegisterForm ENDPOINT={props.ENDPOINT}/> :''}
            <div className='welcome-img-wrapper'>
                <img src={welcomeimg} alt='welcome'></img>
            </div>
            {props.isLogin === '1' ? <LoginForm ENDPOINT={props.ENDPOINT} SetAuth = {SetAuth}/> :''}
            
        </div>
    )
}

export default LoginPage