import React,{useState,useEffect} from 'react';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {useCookies} from 'react-cookie';

const ChatWithFriend = ({ selectedFriend }) => {

  const [postText,setpostText]=useState('')
  const [token]=useCookies(["access_token"])
  const [messages, setMessages] = useState([]); 
  const [profile,setProfile]=useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/getmessage/${selectedFriend.id}`, {
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
        setMessages(jsonData);
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
    .then(resp => setProfile(resp))
    .then(() => console.log(profile))
    .catch(error => console.log(error))
    

    fetchData();
   
  }, [selectedFriend,token]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('receiver',selectedFriend.id);
    formData.append('message_text', postText);
   

    fetch(`http://127.0.0.1:8000/message/${selectedFriend.id}`, {
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
        window.location.reload();
         setpostText('');
      })
      .catch((error) => {
        // Handle error
        console.error('Error creating post:', error);
      });
  };

    return (
      <div>
        <div className="chat-top">
        <Image className="friend-chat-photo mx-2" src={"http://localhost:8000" + selectedFriend.cover} fluid />
        <h3>{selectedFriend.profile_name}</h3>
        </div>
        
        <hr/>
        <div className="chat-with-friend">
        {/*I need to change the color of the chat
        Profile message should be white
        */}
        <div className="chat-bottom">
          {messages.map((item)=>(
                 <Card key={item.id}  style={{
                  backgroundColor:'white'
                }} className="chat-conv my-2" >
                  <Card.Header><b>{item.sender_name}</b></Card.Header>
               
                 <Card.Body>
                  
                     <p>
                     
                       {item.message_text}
                      
                     </p>
                     <footer className="blockquote-footer">
                      {item.date}<cite title="Source Title">| {item.indian_time}</cite>
                    </footer>
                  
                 </Card.Body>
               </Card>
          ))}
             

        </div>

        
      </div>
        <form className="post-message my-2" onSubmit={handleSubmit}>
          <textarea className="sent-message my-2"  value={postText} onChange={e => setpostText(e.target.value)}></textarea>
            <br/>
            <div className="send-button">
            <Button variant="success" type="submit">Send</Button>{' '}
            </div>
        </form>

      </div>
    )
  }

export default ChatWithFriend 
