import React,{useState,useEffect} from 'react'
import Navbar from './Navbar.js'
import Image from 'react-bootstrap/Image';
import {useCookies} from 'react-cookie';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function MyConnections() {

    const [friends,setfriends]=useState([])
    const [token]=useCookies(["access_token"])
    const [user,setUser]=useState([])

   


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


      const fetchDataofAllFriends = async () => {
        try {
          
          const response = await fetch('http://127.0.0.1:8000/allConnections', {
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



      fetchDataofAllFriends();


      const intervalId = setInterval(fetchDataofAllFriends, 5000);

      // Clean up the interval when the component is unmounted
      return () => {
        clearInterval(intervalId);
        console.log("Refreshing")
      };
        

    },[])

    const removeFR = (id) => {
      
      fetch(`http://127.0.0.1:8000/allConnections/${id}/reject/`, {
        method: 'POST',
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

    const [matchingPercentages, setMatchingPercentages] = useState({});
    //Matching data
    const fetchMatchingPercentage = async (id) =>{

      try {
        const response = await fetch(`http://127.0.0.1:8000/matching/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token['access_token']}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Request failed');
        }
  
        const jsonData = await response.json();
        console.log("Matching:",jsonData); // Matching percentage data
        return jsonData; // Return the matching percentage
      } catch (error) {
        console.error('Error:', error);
      }

    }

    useEffect(() => {
      const fetchMatchingPercentagesForFriends = async () => {
        const percentages = {};
        for (const friend of friends) {
          if (user.id === friend.sender) {
            const matchingPercentage = await fetchMatchingPercentage(friend.receiver);
            percentages[friend.receiver] = matchingPercentage;
          } else if (user.id === friend.receiver) {
            const matchingPercentage = await fetchMatchingPercentage(friend.sender);
            percentages[friend.sender] = matchingPercentage;
          }
        }
        setMatchingPercentages(percentages);
      };
  
      fetchMatchingPercentagesForFriends();
    }, [friends]);

  return (
    <div>
        <Navbar/>
      <br/>

      <span className="myCon my-2">
        <h1><b>My Connections</b></h1>
      </span>

      <div className="allfriends">
      {friends.map((item) => (
              
              <Card key={item.id} className="post-content-f my-2 mx-2" style={{ width: '20rem' }}>

                {
                  user.id === item.sender && (
                  <div>
                  <Image className="photo-prof-friend my-2" src={'http://localhost:8000' + (item.receiver_profile)} fluid />
                  <h6><b>Username: </b><a className="singleProfiles" href={`/profile/${item.receiver}`}>{item.receiver_to}</a></h6>
                  
                  {matchingPercentages[item.receiver] ? (
                      <div>
                        {Object.keys(matchingPercentages[item.receiver]).map((key) => {
                          const matchingData = matchingPercentages[item.receiver][key];
                          if (matchingData.pf2 === item.receiver) {
                            return (
                              <h6 key={key}>
                                <b>Matching:</b> {matchingData.matching}
                              </h6>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <h6><b>Matching: </b>N/A</h6>
                    )}


                  </div>
                  )
                }
                 {
                  user.id === item.receiver && (
                  <div>
                  <Image className="photo-prof-friend my-2" src={'http://localhost:8000' + (item.sender_profile)} fluid />
                  <h6><b>Username: </b> <a className="singleProfiles" href={`/profile/${item.sender}`}>{item.sender_from}</a></h6>
                 
                  
                  {matchingPercentages[item.sender] ? (
                      <div>
                        {Object.keys(matchingPercentages[item.sender]).map((key) => {
                          const matchingData = matchingPercentages[item.sender][key];
                          if (matchingData.pf2 === item.sender) {
                            return (
                              <h6 key={key}>
                                <b>Matching</b> {matchingData.matching}
                              </h6>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <h6><b>Matching: </b>N/A</h6>
                    )}
                  
                  </div>
                    )
                }
               
                <hr/>
                <div className="RemoveFriend">
                  <Button className="accept btn btn-dark my-2" onClick={()=>removeFR(item.id)}>Remove</Button>
                 
                </div>
               
              </Card>
              
            ))}

      </div>
      
    </div>
  )
}

export default MyConnections
