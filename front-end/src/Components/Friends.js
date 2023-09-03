import React,{useState,useEffect} from 'react'
import Navbar from './Navbar.js'
import Image from 'react-bootstrap/Image';
import {useCookies} from 'react-cookie';
import Button from 'react-bootstrap/Button';

import Carousel from 'react-bootstrap/Carousel';

import Card from 'react-bootstrap/Card';

//friendRequest
function Friends() {
    const [friends,setfriends]=useState([])
    const [allProfile,setallProfile]=useState([])
    const [token]=useCookies(["access_token"])
    const [user,setUser]=useState([])
    
    const [sendFRError, setsendFRError] = useState(false);
    
    const [activeIndex, setActiveIndex] = useState(0);
    //For showing request sent
    const [friendRequestSent, setFriendRequestSent] = useState({});

    useEffect(()=>{

        const fetchData = async () => {
            try {
              const response = await fetch('http://127.0.0.1:8000/friendRequest', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization':`Bearer ${token["access_token"]}`
                },
              });
      
              if (!response.ok) {
                throw new Error('Request failed');
              }
      
              const jsonData = await response.json();
              console.log(jsonData);
              setfriends(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };

          const fetchDataofAllProfile = async () => {
            try {
              const response = await fetch('http://127.0.0.1:8000/allProfile', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization':`Bearer ${token["access_token"]}`
                },
              });
      
              if (!response.ok) {
                throw new Error('Request failed');
              }
      
              const jsonData = await response.json();
              console.log(jsonData);
              setallProfile(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };

          //profile
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
      
  
      

          //all friends requests
          fetchData();

          //allProfile
          fetchDataofAllProfile();

        

    },[])


    const acceptFR = (id,sender,receiver) => {
      
  
      const formData = new FormData();
      formData.append('id', id);
      formData.append('sender', sender);
      formData.append('receiver', receiver);
      formData.append('status','accept');
  
      fetch(`http://127.0.0.1:8000/friendRequest/${id}/accept/`, {
        method: 'POST',
        body: formData,
        headers: {
          
          'Authorization':`Bearer ${token["access_token"]}`
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle successful response
          console.log('Accepted request:', data);
          window.location.reload();
        })
        .catch((error) => {
          // Handle error
          console.error('Error creating post:', error);
        });
    };


    const rejectFR = (id,sender,receiver) => {
      
  
      const formData = new FormData();
      formData.append('id', id);
      formData.append('sender', sender);
      formData.append('receiver', receiver);
      formData.append('status','send');
  
      fetch(`http://127.0.0.1:8000/friendRequest/${id}/reject/`, {
        method: 'POST',
        body: formData,
        headers: {
          
          'Authorization':`Bearer ${token["access_token"]}`
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle successful response
          console.log('Reject request:', data);
          window.location.reload();
        })
        .catch((error) => {
          // Handle error
          console.error('Error creating post:', error);
        });
    };


    const sendFR = (id) => {
      
      
  
      fetch(`http://127.0.0.1:8000/sendFR/${id}/`, {
        method: 'POST',
       
        headers: {
         
          'Authorization':`Bearer ${token["access_token"]}`
          
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle successful response
          console.log('Send request:', data);
          setsendFRError(false)
          setFriendRequestSent((prevState) => ({ ...prevState, [id]: true }));
          
          //window.location.reload();
        })
        .catch((error) => {
          // Handle error
          setsendFRError(true)
          alert("Alreay sent the friend request")
          console.error('Error creating post:', error);
        });
    };


    const handlePrevSlide = () => {
      setActiveIndex((activeIndex - 1 + allProfile.length) % allProfile.length);
    };
  
    const handleNextSlide = () => {
      setActiveIndex((activeIndex + 1) % allProfile.length);
    };

   
  return (
    <div>
        <Navbar/>
      <br/>
      <h1 className="post-content-head">{friends.length>0 && <h1>Friend Request Received</h1>
        }</h1>
      <div className="friendRequestReceived">
        
      {friends.map(item => (
              
              <Card key={item.id} className="post-content my-2 mx-2" style={{ width: '15rem' }}>
                <Image className="photo-prof-friend" src={"http://localhost:8000"+item.sender_profile} fluid />
                <h6>Sender:{item.sender_from}</h6>
                {/* <h6>Receiver:{item.receiver_to}</h6> */}

                <div className="acceptOrreject">
                  <Button className="accept btn btn-dark mx-2 my-2" onClick={() =>acceptFR(item.id,item.sender_from,item.receiver_to)}>Accept</Button>
                  <Button className="reject btn btn-danger my-2" onClick={() =>rejectFR(item.id,item.sender_from,item.receiver_to)}>Reject</Button>
                </div>
               
              </Card>
              
            ))}

      </div>
      <div className="allProfiles">
      
      <h1>Peoples</h1>


      <Carousel activeIndex={activeIndex} controls={false} className="mineOptions"> 
      {allProfile.map(item => (
          
                
                <Carousel.Item key={item.id}>
                <Image className="allphoto" src={"http://localhost:8000"+item.cover}/>

                <Carousel.Caption>
                    <h2><b>Name:<a className="singleProfiles2" href={`/profile/${item.id}`}>{item.profile_name}</a></b></h2>
                    <Button className="btn btn-primary" onClick={()=>sendFR(item.id)} disabled={friendRequestSent[item.id]}>
                      {friendRequestSent[item.id] ?"Request Already Sent":"Connect"}</Button>
                    
                </Carousel.Caption>
                {sendFRError && <p className="error">Friend request already send</p>}
                </Carousel.Item>
                
              
                
              
            ))}
            <Button className="carousel-control-prev" onClick={handlePrevSlide}>
              Previous
            </Button>
            <Button className="carousel-control-next" onClick={handleNextSlide}>
              Next
            </Button>
        </Carousel>
              
              
        

      

      </div>
    </div>
  )
}

export default Friends
