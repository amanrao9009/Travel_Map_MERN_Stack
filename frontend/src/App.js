import * as React from 'react';
import  { useEffect, useState } from "react";
import {render} from 'react-dom';
import ReactMapGL, {Marker , Popup} from 'react-map-gl';
import {Room , Star} from "@material-ui/icons";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./app.css"
import axios from "axios";
import {format} from "timeago.js";
import Register from './componants/Register';
import Login from './componants/Login';


function App() {
  const myStroage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStroage.getItem("user"));
  const [pins, setPins] = useState([]);
  const  [currentPlaceId,setCurrentPlaceId] = useState(null);
  const  [newPlace,setNewPlace] = useState(null);

  const  [title,setTitle] = useState(null);
  const  [desc,setDesc] = useState(null);
  const  [rating,setRating] = useState(0);

  const [showRegister, setShowRegister]  = useState(false)
  const [showLogin, setShowLogin]  = useState(false)



  const [viewState, setViewState] = React.useState({
    latitude: 28.6562, 
    longitude: 77.2410,
    zoom: 4
  });

  useEffect(()=>{
    const getPins = async ()=>{
      try{
         const res = await axios.get("/pins");//we only use /pin because proxy is set in package.json
         setPins(res.data);
      }catch(err){
        console.log(err)
      }

    };
    getPins()
  },[]);

  const handleMarkerClick = (id,lat,long)=>{
    setCurrentPlaceId(id)
    setViewState({ ...viewState, latitude:lat, longitude:long})
  };

  const handleAddClick = (e) =>{
   
  

    setNewPlace({
      lat:e.lngLat.lat,
      long:e.lngLat.lng

    })
    

  } 

  const handleSubmit = async (e) =>{

    e.preventDefault();

    const newPin = {

    username:currentUser,
    title,
    desc, 
    rating,
    lat:newPlace.lat,
    long:newPlace.long,

    }

   try{

    const res = await axios.post("/pins",newPin);
    setPins([...pins , res.data]);
    setNewPlace(null);

   }catch(err){
     console.log(err)
   }

 
  }

  const handleLogout = () =>{
    myStroage.removeItem("user");
    setCurrentUser(null)
  }



  return (
 

    <div className="App">
    <ReactMapGL
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      
      style={{width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={"pk.eyJ1IjoiYW1hbnJhbzkwMDkiLCJhIjoiY2wwM2E1eHNhMDF0dDNjb2c0dmpmeW56YiJ9.z0Jfu2gsyB0Vu7OgGIz52Q"}
      onDblClick = {handleAddClick}
      transitionDuration="1000"
    > 

    {pins.map(p=>(

<>

      <Marker longitude={p.long} latitude={p.lat}
        offsetLeft={-viewState.zoom * 3.5}
        offsetTop={-viewState.zoom * 7}
       color="red" >
     
      <Room 
      style={{fontSize:viewState.zoom * 7 , color : p.username===currentUser ?"tomato":"slateblue" , cursor:"pointer"}}

      onClick={ ()=>{handleMarkerClick(p._id,p.lat,p.long)}}  
      
      /> </Marker>
       
       { p._id === currentPlaceId && 

        ( 

      
           
       <Popup longitude={p.long} 
       latitude={p.lat}
       closeButton={true}
       closeOnClick={false}
        anchor="left"
        onClose={()=>setCurrentPlaceId(null)}
        >

        <div className="card">   

          <label>Place</label>
          <h4 className="place">{p.title}</h4>
          <label>Review</label>
          <p className="desc">{p.desc}</p>
          <label>Rating</label>
          <div className="stars">
           
           {Array(p.rating).fill( <Star className="star"/>)}
            
          </div>
          <label>Info</label>

          <span className="username">Created by <b>{p.username}</b></span>
           <span className="date">{format(p.createdAt)}</span>

        </div>
      </Popup> 

    
  )}

      </>
 
       ))}

 {newPlace  && (
 
 <Popup longitude={newPlace.long} 
 s
       latitude={newPlace.lat}
       closeButton={true}
       closeOnClick={false}
        anchor="left"
        onClose={()=>setNewPlace(null)}
  >
  <div>
   <form onSubmit={handleSubmit}>
    <label>Title</label>
    <input placeholder = "Enter a title" 
    onChange={(e)=>setTitle(e.target.value)}/>
    <label>Review</label>
    <textarea placeholder="Say something about this place."
    onChange={(e)=>setDesc(e.target.value)}/>
    <label>Rating</label>
    <select onChange={(e)=>setRating(e.target.value)}>
     <option value="1">1</option>
     <option value="2">2</option>
     <option value="3">3</option>
     <option value="4">4</option>
     <option value="5">5</option>

    </select>
    <button className="submitButton" type="submit">Add Pin</button>
   </form>
  </div>
  </Popup> 

  )}

  
  {
    currentUser ? (<button className="button logout" onClick={handleLogout}>Log out</button>) : ( <div className="buttons"> 
  <button className="button login" onClick={()=>setShowLogin(true)}>Login</button>
  <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
  </div>
  )}

 
  
 
   
   {showRegister && <Register setShowRegister={setShowRegister} />} 
   {showLogin && <Login setShowLogin={setShowLogin} myStroage={myStroage} setCurrentUser={setCurrentUser} />}


  
      
    </ReactMapGL>

    </div>
  );
} 
  
export default App;
