import React, { useEffect, useState } from 'react'
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { Link } from 'react-router-dom'
import storageService from '../appwrite/fileUpload'
import { useSelector } from 'react-redux'
import postsService from '../appwrite/posts'
import likesService from '../appwrite/likes'
import { FaRegComment , FaEdit } from 'react-icons/fa'



function PostCard({$id,content,imageId,userId,likeCount,commentsCount,authorName,avatarId}) {
    const[imageUrl,setImageUrl]=useState(null)
    const[avatarUrl,setAvatarUrl]=useState(null)
    const[liked,setLiked]=useState(false)
    const[likes,setLikes]=useState(0)
    const[likeLoading,setLikeLoading]=useState(false)
    




  const loggedInUser=useSelector((state)=>state.auth.userData);

  useEffect(()=>{
    if(loggedInUser && $id){
        likesService.checkUserLike($id,loggedInUser.$id)
        .then(setLiked)
    }
  },[$id,loggedInUser])
 const likeHandler=async ()=>{
    if(!loggedInUser || likeLoading) return;
    setLikeLoading(true)
    try{
    if(liked){
        await likesService.unlikePost($id,loggedInUser.$id)
        setLikes(prev=>Math.max(prev-1,0))
        setLiked(false)
    }else{
        await likesService.likePost($id,loggedInUser.$id)
        setLikes(prev=>prev+1);
        setLiked(true)
    }
}catch(error){
    console.log("like error: ",error)
}finally{
    setLikeLoading(false)
}


 }

 useEffect(()=>{
    const loadLikesCount=async()=>{
        if(!$id) return;
        const count= await likesService.getLikesCountByPost($id);
        setLikes(count)
    }
    loadLikesCount()
 },[$id])



useEffect(()=>{
    async function loadImage(){
        try {
            if(imageId){
                const url=await storageService.getFilePreview(imageId)
                setImageUrl(url)
            }
            if(avatarId){
                const url=await storageService.getFilePreview(avatarId)
                setAvatarUrl(url)
            }
        } catch (error) {
            console.log("image load error",error)
            
        }
    }
    loadImage()
},[imageId,avatarId])






const deleteHandle=async (e)=>{
    e.preventDefault()

    const confirmDelete=window.confirm("Delete this Post ?");
    if(!confirmDelete) return;
    try {
        await postsService.deletePost($id);
        if(imageId){
            await storageService.deleteFile(imageId);
        }
        window.location.reload();


    } catch (error) {
        console.log("error deleting post",error);
        
        
    }


}




return (
    <>
        <div className="postCardWrapper">
            <div className="postLeft">
                <Link to={`/profile/${userId}`}>
                <img src={avatarUrl || "/avatar.jpg"
                } alt="avatar" className='avatar' />
                
                </Link>
            </div>
            <div className="postRight">
                
                <Link to={`/profile/${userId}`}>
                <h3>{authorName  || "Unknown User"}</h3>
                </Link>
                <Link to={`/post/${$id}`}>
                <p className='postContent'>
                {content}
            </p>
             {imageId && (
                <div className="postImage">
                <img src={imageUrl} alt="postImage" onError={(e)=>{console.log("img failed",e.target.src)}} />
                
            </div>
            )}
            </Link>
            

            </div>
        </div>
        <div className="postActions">
                <button className='likeBtn' onClick={likeHandler} disabled={likeLoading}>
                    {liked ? <MdFavorite /> : <MdFavoriteBorder />} {likes}</button>
                <Link to={`/post/${$id}` } className="commentIconLink">
                <button className='commentBtn'><FaRegComment /> {commentsCount}</button>
                </Link>
                 {loggedInUser?.$id ===userId &&(
                    <div className='postOwnerActions'>
                    <Link to={`/edit-post/${$id}`} className='editPostBtn'>
                        <FaEdit />Edit
                    </Link>
                 <button className='deletePostBtn' onClick={deleteHandle}>Delete</button>
                    </div>
               )}
            </div>
        </>

    
    
   
  )
}

export default PostCard