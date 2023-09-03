import React,{useState,useEffect} from 'react'
import {useCookies} from 'react-cookie';
import Navbar from './Navbar.js'
import Image from 'react-bootstrap/Image'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import APIService from '../APIService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faTimes } from '@fortawesome/free-solid-svg-icons'; 

import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

function Profile() {
  const [user,setUser]=useState([])
  const [token]=useCookies(["access_token"])
 // const [tokenR]=useCookies(["refresh_token"])

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showImg, setImg] = useState(false);
  const handleClose2 = () => setImg(false);
  const handleShow2 = () => setImg(true);

  const [first_name,setFirstName]=useState("")
  const [last_name,setLastName]=useState("")
  const [about,setAbout]=useState("")
  const [profileImg,setprofileImg]=useState(null)

  const [selectedInterest, setSelectedInterest] = useState('');
  
  //profile details update
  //This is not the best approach to update details
  const updateProf =()=>{
    
    
    if (first_name.trim().length>0 && last_name.trim().length>0){

      if (about.trim().length>0){
        APIService.UpdateProfile(user.id,{first_name,last_name,about},token["access_token"])
        .then(() => console.log("About"))
        .catch(error=>console.log(error))
      }
  
      else{
        var ab=user.about;
        APIService.UpdateProfile(user.id,{first_name,last_name,ab},token["access_token"])
      .then(() => console.log("Registered"))
      .catch(error=>console.log(error))
      }
      
    }
    else if(first_name.trim().length>0){
      var b=user.last_name;
      if (about.trim().length>0){
        APIService.UpdateProfile(user.id,{first_name,b,about},token["access_token"])
        .then(() => console.log("About"))
        .catch(error=>console.log(error))
      }
      else{
        var ab=user.about;
      APIService.UpdateProfile(user.id,{first_name,b,ab},token["access_token"])
      .then(() => console.log("Registered"))
      .catch(error=>console.log(error))
      }
    }
    else if(last_name.trim().length>0){
      var a=user.first_name;
      if (about.trim().length>0){
        APIService.UpdateProfile(user.id,{a,last_name,about},token["access_token"])
        .then(() => console.log("About"))
        .catch(error=>console.log(error))
      }
      else{
        var ab=user.about;
        APIService.UpdateProfile(user.id,{a,last_name,ab},token["access_token"])
      .then(() => console.log("Registered"))
      .catch(error=>console.log(error))
      }
    }
    else{
      var a=user.first_name;
      var b=user.last_name;

      if (about.trim().length>0){
        APIService.UpdateProfile(user.id,{a,b,about},token["access_token"])
        .then(() => console.log("About"))
        .catch(error=>console.log(error))
      }
      
      else{
        var ab=user.about;
        APIService.UpdateProfile(user.id,{a,b,ab},token["access_token"])
      .then(() => console.log("Registered"))
      .catch(error=>console.log(error))
      }
    }
     
    
  }
  //cover update
  const upCover =()=>{
    console.log("Cover:",user.cover)
    const formData = new FormData();
    formData.append('cover',profileImg);

      console.log(formData)
      APIService.UpdateCOver(user.id,formData,token["access_token"])
      .then(() => console.log("Registered",formData))
      .catch(error=>console.log(error))
  }

  const [getareaOfinterest,setgetareaOfinterest]=useState();

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/profile/',{
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


    const getAreaOfInterest = () =>{
      fetch('http://127.0.0.1:8000/getareaOfinterest',{
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

    getAreaOfInterest()

    const intervalId = setInterval(getAreaOfInterest, 2000);

      // Clean up the interval when the component is unmounted
      return () => {
        clearInterval(intervalId);
        console.log("Refreshing")
      };
    
},[])
//remove area of interest
const handleRemoveInterest = (id) => {
  try {
    fetch(`http://127.0.0.1:8000/deleteareaOfinterest/${id}/delete`, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token['access_token']}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Area of interest deleted:", id);
          alert('Area of interest removed successfully.');
          //window.location.reload()
         
        } else if (response.status === 404) {
          console.log('Area of interest not found');
          alert('Area of interest Not found.');
          window.location.reload()
        } else {
          console.log('Deleting failed');
          alert('Area of interest Not found.');
          window.location.reload()
        }
      })
      .catch((error) => {
        console.error('Error deleting area of interest:', error);
      });
  } catch (error) {
    console.error('Error:', error);
  }
};

//to add area of interest
const areaOfinterest =()=>{

if (selectedInterest){
  const data={
    add_choice:selectedInterest
  };
  fetch('http://127.0.0.1:8000/areaOfinterest',{
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
          'Authorization': `Bearer ${token['access_token']}`,
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (response.ok) {
      // Success: Area of interest added successfully
      
      alert('Area of interest added successfully.');
      //window.location.reload()
    } else {
      // Error: Unable to add area of interest
      alert('Failed to add area of interest.');
      window.location.reload()
    }
  })
  .catch((error) => {
    // Network or other errors
    console.error('Error adding area of interest:', error);
  });
}

}

  return (

    <div>
      <Navbar/>
      <br/>
     
      <div className="Profile">
        <Image className="me" src={"http://localhost:8000"+user.cover} fluid/>

        <div className="updateProfile my-2">
        <Button variant="primary" onClick={handleShow2}>
        Update Profile image
        </Button>
        </div>

        

        <Modal show={showImg} onHide={handleClose2}>
          <Modal.Header closeButton>
            <Modal.Title>Update Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image src={"http://localhost:8000"+user.cover} className="upImage" fluid/>
            <br/>
            <input
              type="file"
              className="form-control-file"
              name="thumbnail"
              onChange={e => setprofileImg(e.target.files[0])}
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose2}>
              Close
            </Button>
            <Button variant="primary" onClick={upCover}>
            Update
            </Button>
          </Modal.Footer>
        </Modal>

        <h5 className="uniqueSlug">@<b>{user.slug}</b></h5>
        <h6 className="mine-detail my-2"><b>Username:</b> {user.first_name} {user.last_name}</h6>
        <h6 className="mine-detail"><b>Connections:</b> {user.num_connections >0 ? `${user.num_connections}` : '0'}</h6>
        <h6 className="mine-detail"><b>About:</b> {user.about}</h6> 
        

        <div className="updateProfile my-2">
          <Button variant="primary" onClick={handleShow}>
          Update Details
          </Button>
        </div>
        <hr/>
        <div>
          <h2><b>Selected Area Of Interests</b></h2>

          <Stack className="areaOfinterest my-4" direction="horizontal" gap={2}>
          {getareaOfinterest && getareaOfinterest.map((interest)=>(
            <Badge bg={interest.add_choice === interest ? 'danger' : 'success'} text="light" key={interest.add_choice}>
            {interest.add_choice} <FontAwesomeIcon icon={faTimes} size="lg" onClick={()=>handleRemoveInterest(`${interest.id}`)} />
            </Badge>
          ))}
          
        </Stack>
        </div>

        <hr/>
        {/*Area of interests code start*/}
        <h2><b>Area of Interests</b></h2>

        {/*
        1)selected are of interest should remain green
        2)selected are of interest should be shown at top with cross.
        */}

        <Stack className="areaOfinterest my-2" direction="horizontal" gap={2}>
     
        {['Fitness','Meditation','Nature','Wildlife','Subconsious Mind','Psychology','Cricket','Football','Travelling','Music','Bhajan','Movies','Books','Ancient Books','Ancient History','Ancient India','Vedic History','Mathematics','Science','Vedic Science','Poems','Astrology','Vastu','Numerology','Healing','Sound Healing','ASMR','Vlog','Politics'].map((interest)=>(
          <Badge bg={selectedInterest === interest ? 'success' : 'light'} text={selectedInterest === interest ? 'light' : 'dark'} key={interest}>
          {interest} <FontAwesomeIcon icon={faPlus} size="lg" value={selectedInterest} onClick={()=>setSelectedInterest(interest)} />
          </Badge>
        ))}
          
        </Stack>

        {/* Button to add the selected interest */}
        {selectedInterest && (
          <Button variant="primary" onClick={areaOfinterest}>
            Add Selected Interest
          </Button>
        )}

        {/*Area of interests code end*/}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update @<b>{user.slug}</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        {/* <input type="file" className="form-control" placeholder="image" id="Pimage" onChange={e=>setprofileImg(e.target.files[0])} /> */}
         <input type="text" className="form-control" id="firstname" placeholder="first name"  value={first_name} 
         onChange={e => setFirstName(e.target.value)}/>
        <br/>
        <input type="text" className="form-control" id="lastname" placeholder="last name" value={last_name} 
        onChange={e => setLastName(e.target.value)}/>
        <br/>
        <textarea className="about-t" placeholder="about" value={about} onChange={e => setAbout(e.target.value)}></textarea>
        <br/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateProf}>
            Update
          </Button>

        </Modal.Footer>
      </Modal>

        
      </div>

       
    
     
    </div>
  )
}

export default Profile
