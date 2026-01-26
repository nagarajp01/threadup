import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {Button,Input} from '../Index'
import storageService from "../../appwrite/fileUpload"
import postsService from '../../appwrite/posts'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'


function PostForm({post}) {
    
    const{register,handleSubmit}=useForm(
        {
            defaultValues:{
                content:post?.content || "",
            }
        }
    );
    const navigate=useNavigate();
    const user=useSelector((state)=>state.auth.userData);

    const[previewUrl,setPreviewUrl]=useState(null)
useEffect(()=>{
    async function loadImage(){
        try {
            if(post?.imageId){
                const url=await storageService.getFilePreview(post.imageId)
                setPreviewUrl(url)
            }
            
        } catch (error) {
            console.log("preview load failed",error);
            
            
        }
    }
    loadImage()
},[post?.imageId])






    const Submit=async (data)=>{
        if(post){
            const file=data.image &&data.image[0]?await storageService.uploadFile(data.image[0]):null;
            if(file){
                await storageService.deleteFile(post.imageId);
            }
            const dbpost=await postsService.updatePost(post.$id,{...data,imageId:file?file.$id:post.imageId})
            if(dbpost){
                navigate(`/post/${dbpost.$id}`);
            }
        }else{
             const file=data.image &&data.image[0]?await storageService.uploadFile(data.image[0]):null;
             const dbpost=await postsService.createPost({
                content:data.content,
                imageId:file?file.$id:null,
                userId:user.$id,
                authorName:user.name,
             })
             console.log("post created",dbpost)
             if(dbpost){
                navigate(`/post/${dbpost.$id}`)
             }
        
        }
    }
  return (
  <form className='postForm' onSubmit={handleSubmit(Submit)}>
    <div className="innerForm">
        <Input
        label="Content"
        placeholder="Whats on your mind..."
        className="contentInput"
        {...register("content",{
            required:true
        })}/>
        <Input
        label="Upload Image"
        type="file"
        className="fileUploadInput"
        accept="image/png,image/jpg,image/jpeg,image/gif"
        {...register("image")}/>
        <div className="postImagewrap">
            {post && <img src={previewUrl} alt='postImage' className='edit-postImage'></img>}
        </div>
        <Button type='submit' className='postFormSubmit' >
            {post?"Update":"Submit"}
        </Button>
    </div>
  </form>
  )
}

export default PostForm