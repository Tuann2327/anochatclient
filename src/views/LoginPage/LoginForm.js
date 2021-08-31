import { useState } from 'react'
import fblogo from '../../assets/facebooklogo.png'
import gglogo from '../../assets/googlelogo.png'
import {Link,useHistory} from 'react-router-dom'
import axios from 'axios'
const LoginForm = (props)=>{
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [isCheck,setIsCheck] = useState(false)
    const [anyErr,setAnyErr] = useState('')
    const history = useHistory();

    const onInputChangeHandle = (e)=>{
        switch(e.target.className){
            case 'email-input':
                setUsername(e.target.value)
                setAnyErr('')
                break
            case 'password-input':
                setPassword(e.target.value)
                setAnyErr('')
                break
            default:
                break
        }
    }

    const onLoginHandle = async (e)=>{
        e.preventDefault()
        console.log(username,password)
        if(username === '' || password === ''){
            setIsCheck(true);
            return
        }
        const data = {
            'username': username,
            'password': password
        }
        
        const isAuth = await axios.get(props.ENDPOINT+'/api/loginauth',{params:data},{ headers: { "Content-Type": "application/x-www-form-urlencoded" } })
        if(!isAuth.data.isMatched){
            setAnyErr('Invalid Username/Email or Password!')
            return
        }
        await props.SetAuth(isAuth.data.token);
        history.push('/home')
    }

    return(
        <form onSubmit={onLoginHandle} className='form-container login-container'>
            <section className='form-header'>
                <h2 className='form-header-title'>
                    AnoChat
                </h2>
                <p className='form-header-des'>
                    To keep connect with us please login with your email and password
                </p>
            </section>
            <section className='form-body'>
                <button className='external-login-button'>
                    <img src={fblogo} alt='facebook logo'/>
                    Login with Facebook
                </button>
                <button className='external-login-button'>
                    <img src={gglogo} alt='google logo'/>
                    Login with Google
                </button>
                <p className='login-des'>Or you can login with your email</p>
                <input onChange={onInputChangeHandle} value={username} className='email-input' placeholder='Email'></input>
                {username === '' && isCheck ? <p className='empty-err'>invalid email or username !</p> : ''}
                <input onChange={onInputChangeHandle} value={password} type='password' className='password-input' placeholder='Password'></input>
                {password === '' && isCheck ? <p className='empty-err'>invalid password !</p> : ''}
                { anyErr !== '' ? <p className='empty-err'>{anyErr}</p> : ''}
                <div className='input-footer'>
                    <div className='remember-me-wrapper'>
                        <input id='remember-me' type='checkbox'/>
                        <label htmlFor='remember-me'>Remember me</label>
                    </div>
                    <a href='#'>Forgot your password?</a>
                </div>
                <button className='internal-login-button'>LOGIN</button>
                <p className='register-wrapper'>Don't have an account? <Link to='/register'>Register</Link></p>
            </section>
        </form>
    )
}

export default LoginForm