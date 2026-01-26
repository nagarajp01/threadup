import React, { useState,useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import postsService from "../appwrite/posts"
import userProfileServ from '../appwrite/userProfiledoc'
import PostCard from './PostCard'
import storageService from '../appwrite/fileUpload'
import { useSelector } from 'react-redux'

function Profile() {
    const[profile,setProfile]=useState(null)
    const[posts,setPosts]=useState([])
    const[loading,setLoading]=useState(true)
    const {userId}=useParams()
    const loggedinUser=useSelector((state)=>state.auth.userData)
    const[imageurl,setImageUrl]=useState(null)
    useEffect(() => {
        const userProfiles=async()=>{
            try {
                const profileResponse=await userProfileServ.getUserProfile(userId)
                setProfile(profileResponse)
            if (!profileResponse){
               setLoading(false);
               return;
            }
            const userProfilePosts=await postsService.getPostsByUser(userId)

            const mergedPosts=userProfilePosts.documents.map((postItem)=>(
                {
                    ...postItem,
                    authorName:profileResponse.name || "Unknown User2",
                    avatarId:profileResponse.avatarId || null,
                }


            ))
            setProfile(profileResponse)
            setPosts(mergedPosts);
            async function loadImage(){
               try {
                 if(profileResponse.avatarId){
                    const url=await storageService.getFilePreview(profileResponse.avatarId)
                    setImageUrl(url)
                }
               } catch (error) {
                console.log("error fetching avatar",error)
                
               }
            }
            loadImage()






            } catch (error) {
                console.log("error in loading profile page",error)
                
            }finally{
                setLoading(false)
            }
            
        }
        userProfiles()
      
    }, [userId])


    if(loading){
       return <div>Loading profile please wait....</div>
    }
    if(!profile){
        return <div>User Not found</div>
    }
    console.log("posts in porfile page",posts)
    
  return (
    <div className="profilePage">
        <div className="profileHeader">
            <img src={imageurl} alt="avatar" className='profileAvatar' onError={(e)=>console.log(e.target.src)}/>
            <h2>{profile.name}</h2>
            <p className='profileUsername'>
                @ {profile.username} </p>
                {profile.bio && <p className='profileBio'>{profile.bio}</p>}
                {loggedinUser?.$id===userId &&(
                    <Link to="/edit-profile">
                        <button className='editProfileBtn'>
                            Edit Profile
                        </button>
                    
                    </Link>
                )}
           
        </div>
        <div className="profilePosts">
            {posts.length===0 ?(
                <div>No posts Yet</div>
            ):(
                posts.map((postItem)=>(
                   <PostCard
            key={postItem.$id}
            $id={postItem.$id}
            content={postItem.content}
            imageId={postItem.imageId}
             userId={postItem.userId}
             likeCount={postItem.likeCount || 0}
              commentsCount={postItem.commentsCount || 0}
            authorName={postItem.authorName}
            avatarId={postItem.avatarId}
            
           
           
            
            />
                ))
            )}
        </div>
    </div>
  )
}

export default Profile