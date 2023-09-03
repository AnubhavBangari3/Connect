import React,{ useEffect, useState } from 'react'
import Navbar from './Navbar.js'
import {useCookies} from 'react-cookie';
import Card from 'react-bootstrap/Card';



function Lifeplan() {
  const [token]=useCookies(["access_token"])
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/lifeplan', {
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

    
    

    fetchData();
   
  }, []);

  

  return (
    <div>
        <Navbar/>
        <br/>
        <h1 className="lp">Life Plan</h1>
        <div className="lifeplan">
            {
              data.map(
                item =>(
                  <Card className="lpi my-2" key={item.id}>
                    <Card.Img variant="top" src={"http://localhost:8000"+item.plan_photo} />
                    <Card.Body>
                      <Card.Text>
                       <b><a href={`/feature/${item.id}`}>{item.plan}</a></b>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )
              )
            }
        </div>
      
    </div>
  )
}

export default Lifeplan
