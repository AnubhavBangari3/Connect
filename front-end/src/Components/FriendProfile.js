import React from 'react'
import Image from 'react-bootstrap/Image';


const FriendProfile =({item, onClickFriend}) => {


  return (
    <div className="message-left my-2" onClick={() => onClickFriend(item)}>
      
      <Image className="friend-photo mx-2" src={"http://localhost:8000" + item.cover} fluid />
      <h6><b><a className="singleProfiles" href={`/profile/${item.id}`}>{item.profile_name}</a></b></h6>
      <hr/>
    </div>
  )
}

export default FriendProfile
