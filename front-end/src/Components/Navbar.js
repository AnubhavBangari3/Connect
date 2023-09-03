import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import React,{useState,useEffect} from 'react'
import {useCookies} from 'react-cookie'
import {useHistory} from 'react-router-dom'

function BasicExample() {
  const [token, setToken, removeToken] = useCookies(["access_token"]);
  const [tokenR, setTokenR, removeTokenR] = useCookies(["refresh_token"]);
  
  let history=useHistory();

  const logginOut = () =>{
    

    fetch('http://127.0.0.1:8000/logout',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token['access_token']}`
      },
      body:JSON.stringify({
        refresh_token:` ${tokenR['refresh_token']}`
      })
    })
    .then(() => {
      
      console.log("Before Refresh:",tokenR['refresh_token'])
      
      removeToken('access_token',{path:'/'});
      removeTokenR('refresh_token',{path:'/'});
      
      console.log("After Refresh:",tokenR['refresh_token'])
      
      window.location.replace('http://localhost:3000/');
      

        
    })
    .catch(error=>console.log(error))
   
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/profile/"><b>Connect</b></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/profile/">My Profile</Nav.Link>
            <Nav.Link href="/post/">Friends Posts</Nav.Link>
            <Nav.Link href="/allPosts/">All Posts</Nav.Link>
            <Nav.Link href="/friends/">Friend Suggestions</Nav.Link>
            <Nav.Link href="/lifeplan/">Life Plan</Nav.Link>
            <Nav.Link href="/messaging/">Inbox</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="/myfriends/">My Connections</NavDropdown.Item>
              
              <NavDropdown.Divider />
              <button className="btn btn-primary mx-2" onClick={logginOut}>Logout</button>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;