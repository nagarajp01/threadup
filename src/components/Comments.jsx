import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import userProfileServ from '../appwrite/userProfiledoc'
import storageService from '../appwrite/fileUpload'
import { Link } from 'react-router-dom'



function Comments({comment,userId}){
const loggedInUser=useSelector((state)=>state.auth.userData)
const[avatar,setAvatar]=useState(null)
const[avatarUrl,setAvatarUrl]=useState(null)
const[name,setName]=useState("")
useEffect(()=>{
    const userProfile=async ()=>{
        try {
            const userProfile=await userProfileServ.getUserProfile(userId);
            if(userProfile){
                setAvatar(userProfile.avatarId)
                setName(userProfile.name)
            }
        } catch (error) {
            console.log("fetching userprofile error",error)
            
        }
    }
userProfile()


},[userId])

useEffect(()=>{
    async function loadImage() {
        try {
            if(avatar){
                const url=await storageService.getFilePreview(avatar)
                setAvatarUrl(url)
            }
            
        } catch (error) {
            console.log("avatar id error",error)
        }
        
    }
    loadImage()
},[avatar])


return(
    <div className="comments">
      
        <div className="comment-header-wrapper">
             <Link to={`/profile/${userId}`} className='commentUserLink'>
            <img src={avatarUrl} alt="avatar url" className='commentsAvatar' onError={(e)=>console.log(e.target.src) }/>
        <p className='comment-username'>{name}</p>
        </Link>
      
       </div>
        <p className='comment-text'>{comment}</p>
    </div>



)


}



export default Comments