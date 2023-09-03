import React,{useState,useEffect} from 'react'
import Navbar from './Navbar.js'

import {useCookies} from 'react-cookie';


import FriendProfile from './FriendProfile';
import ChatWithFriend from './ChatWithFriend';

function Messaging() {
  const [messageReceived]=useState(true)
  const [user,setUser]=useState([])
  const [token]=useCookies(["access_token"])

  const [selectedFriend, setSelectedFriend] = useState(null);
  const onClickFriend = (friend) => {
    setSelectedFriend(friend);
  };


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/allfriends', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token['access_token']}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data.');
        }

        const data = await response.json();
        console.log('Data:', data); // Log the response data
        setUser(data);
      } catch (error) {
        console.log('Error:', error); // Log any errors
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <Navbar/>
        <br/>
        
        {messageReceived === true ? (<b><h1 className="messageR my-2">Messages Received</h1></b>):(<h1 className="messageS my-2">Messages Sent</h1>)}
      
        <hr/>
        <div className="messaging-functionality">
            <div className="friend-list">
              {user.map((item) => (
                <FriendProfile key={item.id} item={item} onClickFriend={onClickFriend} />
              ))}
            </div>

           {/* Display chat-section if a friend is selected */}
            {selectedFriend ? (
              <div className="chat-section">
                <ChatWithFriend selectedFriend={selectedFriend} />
              </div>
            ) : (
              <div className="chat-section2">
                {/* Empty div to show the chat-section when no friend is selected */}
              </div>
            )}

        </div>

         
        
       
    </div>
  )
}

export default Messaging
