import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom';
import APIService from '../APIService.js';
import {useCookies} from 'react-cookie';

function Login() {
  let history=useHistory();
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [token,setToken]=useCookies(["access_token"])
  const [tokenR,setTokenR]=useCookies(["refresh_token"])

  const [loginError, setLoginError] = useState(false);

  const [existProfile,setexistProfile]=useState([]);

  useEffect (()=>{

    //profile
    fetch('http://127.0.0.1:8000/allProfileauth',{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        //'Authorization':`Bearer ${token["access_token"]}`
      }
      })
      .then(resp =>resp.json())//profile_name
      .then((data) => {
        //console.log(data)
        const profileNames = data.map((profile) => profile.profile_name);
        setexistProfile(profileNames);
        })
      .then(() => console.log(existProfile))
      .catch(error => console.log(error))
  },[])
  
  const loginBtn =() =>{

    
      if (existProfile.includes(username)){
        APIService.Login({username,password})
      .then(resp => resp)
      .then(
        resp =>{
          if (resp.access) {
            setToken("access_token", resp.access);
            setTokenR("refresh_token", resp.refresh);
            setLoginError(false);
            if (token['access_token']){
              history.push('/profile/')
            window.location.reload()}
            else{
              window.location.reload()
            }
            // Successful login, handle redirection or further actions here
          } else {
            setLoginError(true);
            if (loginError){
              setTimeout(() => {
                window.location.reload();
              }, 2000); 
            }
          }
        }
      )
      .then(() => console.log("Login"))
      .catch(error=>{
        console.log(error)
        setLoginError(true)
        setUsername('');
        setPassword('');
        if (loginError){
          setTimeout(() => {
            window.location.reload();
          }, 2000); 
        }
      })
      }
      else{
        console.log("Error while login")
        setLoginError(true)
        setUsername('');
        setPassword('');
        if (loginError){
          setTimeout(() => {
            window.location.reload();
          }, 2000); 
        }
        
      }

    
  }

  return (
    <div className="main">
      <div className="login">
        <span className="login-title"><h1><b>CONNECT</b></h1></span>
        <div className="login-form">
        
          <input type="text" className="form-control" name="username" id="username" placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}/>
          <br/>
          
          <input type="password" className="form-control" name="password" id="password" placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}/>
          {(username && password)?<button className="btn btn-warning my-2" onClick={loginBtn}><b>LOGIN</b></button>:
          <button className="btn btn-warning my-2"><b>Please fill the details</b></button>}
          {loginError && <div className="error-message">Invalid username or password</div>}

          {/* <button className="btn btn-primary my-2">Sign in with Social</button> */}
        </div>

        <p><b>Create an account <button className="btn btn-dark" onClick={() => 
            {history.push('/register/')
            window.location.reload()}}>register</button></b></p>
      
      </div>
      <div className="quote">
        <h2>
          LIFE HAPPENS FOR YOU, NOT TO YOU
        </h2>
      </div>
    </div>
  )
}

export default Login
