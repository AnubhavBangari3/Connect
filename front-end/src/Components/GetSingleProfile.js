import React,{useState,useEffect} from 'react'
import {useCookies} from 'react-cookie';
import Navbar from './Navbar.js'
import Image from 'react-bootstrap/Image'
import { useParams } from 'react-router-dom';

import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

function GetSingleProfile() {
  const [user,setUser]=useState([])
  const [token]=useCookies(["access_token"])
  const { id } = useParams();
  const [getareaOfinterest,setgetareaOfinterest]=useState();

  useEffect(()=>{
    fetch(`http://127.0.0.1:8000/getSingleProfile/${id}`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token['access_token']}`
      }
    })
    .then(resp =>resp.json())
    .then(resp => setUser(resp))
    .then(() => console.log(user))
    .catch(error => console.log(error))
    
  
    //For the particular profile Id
    const getAreaOfInterest = () =>{
      fetch(`http://127.0.0.1:8000/getProfileareaOfinterest/${id}`,{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
            'Authorization': `Bearer ${token['access_token']}`,
      },

      })
      .then((resp)=>resp.json())
      .then((data)=>setgetareaOfinterest(data))
      .then((error)=>console.log(error))
    }

    getAreaOfInterest();


    
},[])
  return (
    <div>
      <Navbar/>
      <br/>
      <div className="Profile">
        <Image className="me" src={"http://localhost:8000"+user.cover} fluid/>


        <h5 className="uniqueSlug">@<b>{user.slug}</b></h5>
        <h6 className="mine-detail my-2"><b>Username:</b> {user.first_name} {user.last_name}</h6>
        <h6 className="mine-detail"><b>Connections:</b> {user.num_connections >0 ? `${user.num_connections}` : '0'}</h6>
        <h6 className="mine-detail"><b>About:</b> {user.about}</h6> 

        <hr/>
        <div>
          <h2><b>Selected Area Of Interests</b></h2>

          <Stack className="areaOfinterest my-4" direction="horizontal" gap={2}>
          {getareaOfinterest && getareaOfinterest.map((interest)=>(
            <Badge bg={interest.add_choice === interest ? 'danger' : 'success'} text="light" key={interest.add_choice}>
            {interest.add_choice}
            </Badge>
          ))}
          
        </Stack>
        </div>




        
      </div>

      
    </div>
  )
}

export default GetSingleProfile
