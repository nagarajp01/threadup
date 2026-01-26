import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import postsService, { PostsService } from '../appwrite/posts'
import PostForm from './PostForm/PostForm'

function EditPost() {
    const {id}=useParams()
    const[post,setPost]=useState(null);
    const[loading,setLoading]=useState(true)
    useEffect(()=>{
        const fetchPost= async()=>{
           try {
            const postItem= await postsService.getPost(id);
           setPost(postItem)
            
           } catch (error) {
            console.log("error in fetching single post to edit",error)
            
           }finally{
            setLoading(false)
           }

        }
        fetchPost()
        
    },[id])
    if(loading) return <p>Loading....</p>
    if(!post) return <p>Post not found</p>
  return <PostForm post={post} />
}

export default EditPost