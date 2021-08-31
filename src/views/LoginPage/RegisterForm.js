import {Link, useHistory} from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import QueryString from 'qs'
const RegisterForm = (props)=>{
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [cPassword,setCPassword] = useState('')
    const [isCheck,setIsCheck] = useState(false)
    const [anyErr,setAnyErr] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const history = useHistory();

    const onInputChangeHandle = (e)=>{
        switch(e.target.className){
            case 'name-input':
                setUsername(e.target.value)
                setAnyErr('')
                break
            case 'email-input':
                setEmail(e.target.value)
                setAnyErr('')
                break
            case 'password-input':
                setPassword(e.target.value)
                setAnyErr('')
                break
            case 'confirm-password-input':
                setCPassword(e.target.value)
                setAnyErr('')
                break
            default:
                break
        }
    }


    const onRegisterHandle = async (e)=>{
        e.preventDefault()
        setIsCheck(true);
        if(username === '' || password === '' || cPassword === '' || email=== ''){
            return
        }
        if(password.length < 6) { setAnyErr('Password - must be 6 or more in length !'); return}
        if(username.length < 6) { setAnyErr('Username - must be 6 or more in length !'); return}
        if(cPassword !== password) { setAnyErr('Confirm Password is not match !'); return}
        const data = QueryString.stringify({
            'username': username,
            'email': email,
            'password': password
        })
        setIsLoading(true)
        const isCreated = await axios.post(props.ENDPOINT+'/api/accounts/new',data,{ headers: { "Content-Type": "application/x-www-form-urlencoded" } })
        setIsLoading(false)
        if(!isCreated.data.isCreated){ setAnyErr(isCreated.data.error); return}
        history.push('/login')
    }

    return(
        <form onSubmit={onRegisterHandle} className='form-container register-container'>
            <section className='form-header'>
                <h2 className='form-header-title'>
                    Registration
                </h2>
                <p className='form-header-des'>
                    Enter your information to create your account
                </p>
            </section>
            <section className='form-body'>
                <input value={username} onChange={onInputChangeHandle} className='name-input' placeholder='Username'></input>
                {username === '' && isCheck ? <p className='empty-err'>This field cannot be empty !</p> : ''}
                <input value={email} onChange={onInputChangeHandle} className='email-input' placeholder='Email'></input>
                {email === '' && isCheck ? <p className='empty-err'>This field cannot be empty !</p> : ''}
                <input value={password} onChange={onInputChangeHandle} type='password' className='password-input' placeholder='Password'></input>
                {password === '' && isCheck ? <p className='empty-err'>This field cannot be empty !</p> : ''}
                <input value={cPassword} onChange={onInputChangeHandle} type='password' className='confirm-password-input' placeholder='Confirm password'></input>
                {cPassword === '' && isCheck ? <p className='empty-err'>This field cannot be empty !</p> : ''}
                { anyErr !== '' ? <p className='empty-err'>{anyErr}</p> : ''}
                <div className='input-footer'>
                    <div className='remember-me-wrapper'>
                        <input id='term-of-use' type='checkBox'></input>
                        <label htmlFor='term-of-use'>Auto login after created account</label>
                    </div>
                    <a href='#'>Read more</a>
                </div>
                <button disabled={isLoading ? true  : false} className='internal-login-button'>CREATE ACCOUNT</button>
                <p className='register-wrapper'>Already have an account? <Link to='/login'>Login</Link></p>
            </section>
        </form>
    )
}

export default RegisterForm