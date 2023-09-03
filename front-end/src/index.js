import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.css';
import {Route,BrowserRouter} from 'react-router-dom'
import {CookiesProvider} from 'react-cookie'
import Login from './Components/Login.js'
import Register from './Components/Register.js'
import Profile from './Components/Profile.js'
import Post from './Components/Post.js'
import Friends from './Components/Friends.js'
import MyConnections from './Components/MyConnections.js'
import Lifeplan from './Components/Lifeplan.js'
import Messaging from './Components/Messaging.js' 
import SinglePost from './Components/SinglePost.js'
import Feature from './Components/Feature.js';
import OneMonthVisual from './Components/OneMonthVisual.js';
import SixMonthVisual from './Components/SixMonthVisual.js';
import OneYearVisual from './Components/OneYearVisual.js';
import ThreeYearVisual from './Components/ThreeYearVisual.js';
import FiveYearVisual from './Components/FiveYearVisual.js';
import TenYearVisual from './Components/TenYearVisual.js';
import AllPosts from './Components/AllPosts.js';
import GetSingleProfile from './Components/GetSingleProfile.js';

function Router(){
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Route exact path="/" component={Login}/>
        <Route exact path="/register/" component={Register}/>
        <Route exact path="/profile/" component={Profile}/>
        <Route exact path="/post/" component={Post}/>
        <Route exact path="/friends/" component={Friends}/>
        <Route exact path="/myfriends/" component={MyConnections}/>
        <Route exact path="/lifeplan/" component={Lifeplan}/>
        <Route exact path="/messaging/" component={Messaging}/>
        <Route exact path="/singlepost/:id" component={SinglePost}/>
        <Route exact path="/feature/:id" component={Feature} />
        <Route exact path="/vision/:id" component={OneMonthVisual} />
        <Route exact path="/vision2/:id" component={SixMonthVisual} />
        <Route exact path="/vision3/:id" component={OneYearVisual} />
        <Route exact path="/vision4/:id" component={ThreeYearVisual} />
        <Route exact path="/vision5/:id" component={FiveYearVisual} />
        <Route exact path="/vision6/:id" component={TenYearVisual} />
        <Route exact path="/allPosts/" component={AllPosts}/>
        <Route exact path="/profile/:id" component={GetSingleProfile}/>
      </BrowserRouter>
    </CookiesProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
