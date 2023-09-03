import React,{useState} from 'react'
import {useHistory} from 'react-router-dom';
import APIService from '../APIService.js';

import Alert from 'react-bootstrap/Alert';

function Register() {
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [first_name,setFirstName]=useState("")
  const [last_name,setLastName]=useState("")
  const [password,setPassword]=useState("")
  const [password2,setPassword2]=useState("")

  let history=useHistory();

  const registerBtn =() =>{
    APIService.Register({username,email,first_name,last_name,password,password2})
    .then(() => console.log("Registered"))
    .then(() => history.push('/'))
    .then(() => window.location.reload())
    .catch(error=>console.log(error))
  }

  return (
    <div className="main-register">
    <div className="register">
      <span className="register-title"><h1><b>CONNECT</b></h1></span>
      <div className="login-form">
      
        <input type="text" className="form-control" id="username" placeholder="Username"value={username}
         onChange={e => setUsername(e.target.value)}/>
        <br/>
        <input type="email" className="form-control" id="email" placeholder="Enter your Email"
            value={email} onChange={e => setEmail(e.target.value)}/>
          <br/>
        <input type="text" className="form-control" id="firstname" placeholder="first name" value={first_name}
         onChange={e => setFirstName(e.target.value)}/>
        <br/>
        <input type="text" className="form-control" id="lastname" placeholder="last name" value={last_name} 
        onChange={e => setLastName(e.target.value)}/>
        <br/>
        
        <input type="password" className="form-control" id="password" placeholder="Password" value={password}
        onChange={e => setPassword(e.target.value)}/>
        <br/>
        <input type="password" className="form-control" id="password2" placeholder="Confirm Password" value={password2}
        onChange={e => setPassword2(e.target.value)}/>

        {(username && email && first_name && last_name && password && password2)
        ? <button className="btn btn-warning my-2" onClick={registerBtn} disabled={(password !== password2)}><b>Register</b></button> :
        <button className="btn btn-warning my-2"><b>Please fill the details</b></button>}
        
        
        <Alert variant="warning" show={password !== password2}>
          Password is not matching
        </Alert>
        

        <button className="btn btn-info my-2" onClick={() => 
            {history.push('/')
            window.location.reload()}}><b>Back</b></button>
        
      </div>

      
    
    </div>
   
  </div>
  )
}

export default Register
