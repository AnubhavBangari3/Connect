import React,{ useEffect, useState } from 'react'
import Navbar from './Navbar.js'
import {useCookies} from 'react-cookie';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function AllPosts() {
  const [token]=useCookies(["access_token"])
  const [data, setData] = useState([]);
  const [user,setUser]=useState([]);
  const [showImageId, setShowImageId] = useState(null); // State to store the ID of the image whose modal is open

  const handleClose = () => setShowImageId(null); // Reset the ID to close the modal
  const handleShow = (imageId) => setShowImageId(imageId); // Set the ID to show the modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/getallpost', {
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
        setData(jsonData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

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
    

    fetchData();
    const intervalId = setInterval(fetchData, 2000);

      // Clean up the interval when the component is unmounted
      return () => {
        clearInterval(intervalId);
        console.log("Refreshing")
      };
   
  }, []);

  const like = async (id) =>{
    try{
      const resp = await fetch(`http://127.0.0.1:8000/posts/${id}/like`,{
      method:'POST',
      headers: {
        'Authorization':`Bearer ${token["access_token"]}`
      },
     
    });

    if (resp.ok){
      console.log("Post Likes:",id);
      //window.location.reload();
    }
    else{
      alert("You have Already liked this post")
      console.log("Like failed");
    }

    }catch(error){
      console.log("Error")
    }
}

  return (
    <div>
      <Navbar/>
        <br/>

        <div className="allpostsofuser">

         
         <div className="allgrid">
         {data.map( item =>(
            <div key={item.id} className="allposts-prof">
             
              <Image className="allposts-phots mx-2 my-2" src={"http://localhost:8000"+item.image_post} onClick={() => handleShow(item.id)} />

              <Modal show={showImageId === item.id} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="name_and_photo"><Image className="all-photo-prof mx-2" src={"http://localhost:8000"+item.profile_picture} roundedCircle/>
                <h6><b><a className="singleProfiles" href={item.owner === user ?`/profile/`:`/profile/${item.owner}`}>{item.owner_post}</a></b></h6></Modal.Title>
              </Modal.Header>
              <Modal.Body className="posts-insde-modal">
              <Image className="posts-insde-modal-image" src={"http://localhost:8000"+item.image_post} />
                {item.text_post}
              </Modal.Body>
              <hr/>
              <div className="posts-insde-modal-foot">
              <Button variant="primary" onClick={()=>like(item.id)}>Like {item.total_likes}</Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
               
              </div>
            </Modal>

            </div>
          )
            
          )}
         </div>
         
    
          
          
        </div>
      
    </div>
  )
}

export default AllPosts
