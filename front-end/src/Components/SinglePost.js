import React,{ useEffect, useState } from 'react'
import {useCookies} from 'react-cookie';
import Navbar from './Navbar.js'
import {useParams,useHistory} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Placeholder from 'react-bootstrap/Placeholder';

function SinglePost() {
  const params = useParams();
  console.log(params.id);
  const [user,setUser]=useState([]);
  const [token]=useCookies(["access_token"])
  const [data, setData] = useState([]);
  let history=useHistory();
  const [postText,setpostText]=useState("")
  const [commentdata, setCommentdata] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/getposts/${params.id}/`, {
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
        console.log(jsonData)
        setData(jsonData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchCommentData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/commentPost/${params.id}/comments/`, {
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
        console.log(jsonData)
        setCommentdata(jsonData);
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
    fetchCommentData();
    const intervalId = setInterval(fetchCommentData, 2000);

      // Clean up the interval when the component is unmounted
      return () => {
        clearInterval(intervalId);
        console.log("Refreshing")
      };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('text_post', postText);
    

    fetch(`http://127.0.0.1:8000/commentPost/${params.id}/`, {
      method: 'POST',
      body: formData,
      headers: {
        
        'Authorization':`Bearer ${token["access_token"]}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle successful response
        console.log('Comment created successfully:', data);
        setpostText('');
        //window.location.reload();
      })
      .catch((error) => {
        // Handle error
        console.error('Error creating post:', error);
      });
  };

  const moveBack = () =>{
    history.push('/post/')
    window.location.reload()
  }


  return (
    <div>
      <Navbar/>
      <br/>
      <Button className="btn btn-dark mx-2" onClick={moveBack}>Back</Button>
      <div className="singlePost">

         {/* Render the post data start */}
         {data &&  (
               <Card key={data.id} className="post-content my-2">
               <div className="top-post">
               <div className="prof-post">
                 
               <Image className="photo-prof" src={"http://localhost:8000"+data.profile_picture} roundedCircle fluid />
               <Card.Title className="prof-name my-2"><b><a className="singleProfiles" href={data.owner === user ?`/profile/`:`/profile/${data.owner}`}>{data.owner_post}</a></b></Card.Title>
               
               </div>
              
               </div>
             <Card.Img variant="top" src={"http://localhost:8000"+data.image_post} className="my-post my-2" />
             <Card.Body>
               
               <Card.Text className="pst-text">
                 <b>{data.text_post}</b>
               </Card.Text>
               
             </Card.Body>
             </Card>
              
              
            )}
           
          {/* Render the post data end */}
          <Form className="comment" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label><b>Comment:</b></Form.Label>
              <Form.Control as="textarea" rows={5} value={postText} onChange={e => setpostText(e.target.value)} />
            </Form.Group>
            {(postText)?<Button className="success" type="submit">Comment</Button>:
          <button className="btn btn-warning my-2"><b>Any Comment?</b></button>}
            
          </Form>
          <hr/>
      </div>
      
      <div className="allComments">
        
          <Accordion defaultActiveKey="0" className="scroll-container">
            {
            commentdata.map(
              item => (
                <Accordion.Item eventKey={item.id}>
                  
                    <Accordion.Header><Placeholder xs={12} bg="light">
                      <h4><b><a className="singleProfiles" href={`/profile/${item.owner_posting}`}>{item.name_owner_posting}</a></b> | {item.date} <cite title="Source Title">| {item.indian_time}</cite></h4>
                      </Placeholder>
                    </Accordion.Header>
                    <div key={item.id}>
                    <Accordion.Body className="comm">
                      
                      <p><b>{item.text_post}</b></p>
                    </Accordion.Body>
                  </div>
                    
                </Accordion.Item>
                
                
                  )
                )
            }
            
            
          </Accordion>
       

      </div>

    </div>
  )
}

export default SinglePost
