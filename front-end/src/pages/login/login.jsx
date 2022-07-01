import "./login.css"
import { Button } from '../../components/Button'
import TextField from '@mui/material/TextField'
import { Link } from "react-router-dom"
import { useState } from "react"
import axios from 'axios'
import { useHistory } from "react-router"



export default function Login({ setLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [mStyle, setmStyle] = useState("")
    const history = useHistory()

    const onLogin = async (e) => {

        if (!email || !password) {
            e.preventDefault()
            setmStyle("messageShow")
            setMessage("Email or password fields are missing!")
            setTimeout(() => {
                setmStyle("")
                setMessage("")
            }, 4000);
            return
        }

        const loginDetails = {
            email: email,
            password: password
        };

        try {

            const res = await axios.post('/api/login', loginDetails)
            if (res.status === 200) {
                localStorage.setItem('token', res.data.token)
                setmStyle("messageShow")
                setMessage(res.data.message)
                setLoggedIn(true)
                localStorage.setItem('loggedIn', "True")
                setTimeout(() => {
                    setmStyle("")
                    setMessage("")
                    history.push('/')
                }, 1500)

            }
        } catch (err) {
            e.preventDefault()
            setmStyle("messageShow")
            setMessage(err.response.data.message)
            setTimeout(() => {
                setmStyle("")
                setMessage("")
            }, 4000);
        }

    }


    return (
        <div className="loginPage">
            <div className='signinTitle1'>
                <h2>LinkedNYU</h2>
            </div>
            <div className="signinTitle">
                Sign in
            </div>
            <div className="inputArea">
                <div className="emailArea">
                    <label htmlFor="email"> Email </label>
                    <TextField variant="outlined"
                        required
                        className="emailInput"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}>
                    </TextField>
                </div>
                <div className="passwordArea">
                    <label htmlFor="password"> Password </label>
                    <TextField variant="outlined"
                        type="Password"
                        required
                        id="password"
                        className="passwordInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}>
                    </TextField>
                </div>
                <div className={mStyle}>
                    <p className="errMessage">{message}</p>
                </div>
                <div className="underArea">
                    <div className="otherOptions">
                        <div>
                            <Link to="/pwreset" className="otherOptIns">Forgotten Password?</Link>
                        </div>
                        <div>
                            <Link to="/signup" className="otherOptIns">I'm new, Sign me up!</Link>
                        </div>
                    </div>
                    <div className="loginButtonArea">
                        <Button onClick={onLogin} buttonSize="btn--large" buttonStyle="btn--primary--solid" className="loginButton">Go!</Button>
                    </div>
                </div>
            </div>
        </div >
    )
}