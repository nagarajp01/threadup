import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import postsService from "../appwrite/posts"
import userProfileServ from '../appwrite/userProfiledoc'
import PostCard from './PostCard'
import commentService from '../appwrite/comments';
import { useSelector } from 'react-redux'
import {Input,Button} from "./Index"
import { useForm } from 'react-hook-form'
import Comments from './Comments'
import { FaTrash } from 'react-icons/fa'
function PostDetail() {
    const[postItem,setPostItems]=useState(null)
    const[loading,setLoading]=useState(true)
    const[comments,setComments]=useState([])
    // const[commentsCount,setCommentCount]=useState(0)
    // const[text,setText]=useState("")
    // const[commentLoading,setCommentLoading]=useState(false)
    const{register,handleSubmit,reset}=useForm()
    const loggedInUser=useSelector((state)=>state.auth.userData);

    const {id}=useParams();
   useEffect(() => {
    const post=async()=>{
       try {
         const postResponse=await postsService.getPost(id)
        const userDetails=await userProfileServ.getUserProfile(postResponse.userId)
        const mergedPost={
            ...postResponse,
            authorName:userDetails ?.name || "Unknown User",
            avatarId:userDetails?.avatarId || null,
        }
        
        setPostItems(mergedPost)
       } catch (error) {
         console.log("Error at feed while fetching postDetails",error);
        
       }finally{
        setLoading(false)
       }
        
    }
    post()
   }, [id])
 
    useEffect(()=>{
   async function commentsFetch() {
    try {

        if(!postItem || !postItem.$id) return;
        if(loggedInUser && postItem.$id){
        const res=await commentService.getCommentsByPost(postItem.$id)
        setComments(res.documents)
    }else{
        return;
    }  
    } catch (error) {
        console.log("error in commentsFetch..",error)
        
    }
   }
   commentsFetch();
 },[postItem])



    const commentHandler=async (data)=>{
    if(!loggedInUser) return;
    try {
        await commentService.addComment(
       {
        postId: postItem.$id,
        userId:loggedInUser.$id,
        content:data.comment
       }
    );
    await postsService.updatePost(postItem.$id,
        {
            commentsCount:(postItem.commentsCount || 0)+1
        }
    )
    setPostItems(prev=>(
        {
            ...prev,
            commentsCount:(prev.commentsCount||0)+1
        }
    ))


    reset()

    // setText("")
    const res=await commentService.getCommentsByPost(postItem.$id);
    setComments(res.documents)
        
    } catch (error) {
        console.log("errors in adding comments",error)
        
    }

 }


 const deleteCommentHandle=async (e,commentId)=>{
    e.preventDefault()
    const confirmDelete=window.confirm("Delete this comment")
    if(!confirmDelete) return;
    try {
        await commentService.deleteComment(commentId)
        await postsService.updatePost(postItem.$id,{
            commentsCount:Math.max((postItem.commentsCount || 1)-1,0)
        })
        setPostItems((prev)=>({
            ...prev,
            commentsCount:Math.max((prev.commentsCount || 1)-1,0)
        }))
       setComments(prev=>prev.filter(c=>c.$id!==commentId))
        
    } catch (error) {
        console.log("delete comment error",error)
        
    }


}
  if(loading){
    return <div>Please Wait Post Is Fetching....</div>
   }
   if(!postItem){
    return <div>Post Not Found</div>
   }


console.log("postsitems in postdetails",postItem)

   return(
    <div className="singlePost">
        <PostCard
            $id={postItem.$id}
            content={postItem.content}
            imageId={postItem.imageId}
            userId={postItem.userId}
            authorName={postItem.authorName}
            avatarId={postItem.avatarId}
            likeCount={postItem.likeCount || 0}
            commentsCount={postItem.commentsCount}
            />
           
            <div className="commentsList">
                <label className='commentLabel'>Comments</label>
                {comments.map((item)=>(
                    <div key={item.$id} className="comment">
                        <Comments comment={item.content} userId={item.userId} />
                         {loggedInUser?.$id===item.userId &&(
                        <button className='deleteBtn' onClick={(e)=>deleteCommentHandle(e,item.$id)} ><FaTrash /></button>
                        )}
                    </div>

                ))}
            </div>
             <div className="commentSection">
               
                 {loggedInUser && (
                    <form onSubmit={handleSubmit(commentHandler)} className='commentInput'>

                        <Input  
                        className ="commentIp"
                        placeholder="Post a Comment"
                        {...register("comment",{
                            required:true,
                        })}
                        />
                        <Button type='submit' className='postBtn'>
                            Post
                        </Button>
                    </form>
                    
                )}
               
               
            </div>




    </div>
   )
   
}

export default PostDetail