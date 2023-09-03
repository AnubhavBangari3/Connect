import React,{ useEffect, useState } from 'react'
import Navbar from './Navbar.js'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useCookies} from 'react-cookie';
import Card from 'react-bootstrap/Card';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import Image from 'react-bootstrap/Image';

function Post() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [postText,setpostText]=useState("")
    const [postImg,setpostImg]=useState(null)
    const [user,setUser]=useState([])

    const [token]=useCookies(["access_token"])
    

    const [data, setData] = useState([]);

    

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/getposts', {
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

    const deletePost = async (id) =>{
        try{
          const resp = await fetch(`http://127.0.0.1:8000/deletePost/${id}`,{
          method:'DELETE',
        });

        if (resp.ok){
          console.log("Post deleted:",id);
          window.location.reload();
        }
        else{
          console.log("Deleting failed");
        }

        }catch(error){
          console.log("Error")
        }
    }

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
        console.log("Like failed");
        alert("Post is already liked")
      }

      }catch(error){
        console.log("Error")
      }
  }


    const handleSubmit = (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('text_post', postText);
        formData.append('image_post', postImg);
    
        fetch('http://127.0.0.1:8000/posts', {
          method: 'POST',
          body: formData,
          headers: {
            
            'Authorization':`Bearer ${token["access_token"]}`
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle successful response
            console.log('Post created successfully:', data);
            //window.location.reload();
          })
          .catch((error) => {
            // Handle error
            console.error('Error creating post:', error);
          });
      };

  return (
    <div>
      <Navbar/>
      <br/>
      <div className="createPost">
        <Button variant="dark" onClick={handleShow}>
            Create Posts
        </Button>
      </div>
      <hr/>

      <div className="allPosts">

      

          {/* Render the post data start */}
            {data.map(item => (
              
              <Card key={item.id} className="post-content my-2">
                <div className="top-post">
                <div className="prof-post">
                  
                <Image className="photo-prof" src={"http://localhost:8000"+item.profile_picture} roundedCircle fluid />
                <Card.Title className="prof-name my-2"><b><a className="singleProfiles" href={item.owner === user.id ?`/profile/`:`/profile/${item.owner}`}>{item.owner_post}</a></b></Card.Title>
                </div>
                {user.profile_name === item.owner_post &&
                  <DropdownButton id="dropdown-basic-button" title={<i className="fas fa-ellipsis-v" />}>
                    
                    <Dropdown.Item onClick={() => deletePost(item.id)} >Delete</Dropdown.Item>
                  
                  </DropdownButton>
                }
                
                </div>
              <Card.Img variant="top" src={"http://localhost:8000"+item.image_post} className="my-post my-2" />
              <Card.Body>
                
                <Card.Text className="pst-text">
                  <b>{item.text_post}</b>
                </Card.Text>
                <div className="allbuttons">
                  <Button variant="primary" onClick={()=>like(item.id)}>Like {item.total_likes}</Button>
                  <Button variant="dark"><a href={`/singlepost/${item.id}`} style={{"color":"white"}}>Comment</a></Button>
                 

                </div>
                
              </Card.Body>
              </Card>
              
            ))}
           
          {/* Render the post data end */}
      </div>

      <Modal show={show} onHide={handleClose}>

        <Modal.Body>
        
        <form onSubmit={handleSubmit}>

            <input
                type="file"
                className="form-control-file"
                name="thumbnail"
                onChange={e => setpostImg(e.target.files[0])}
                required
                />

            <br/>
            <textarea className="about-t" placeholder="about" value={postText} onChange={e => setpostText(e.target.value)}></textarea>
            <br/>
            <Button className="createpostbtn" type="submit" onClick={handleClose}>Create Post</Button>
        </form>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>




    </div>
  )
}

export default Post
