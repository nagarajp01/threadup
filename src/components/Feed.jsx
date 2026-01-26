import React, { useEffect, useState } from 'react'
import postsService from '../appwrite/posts'
import userProfileServ from '../appwrite/userProfiledoc'
import PostCard from './PostCard'
import { Query } from 'appwrite'

function Feed() {
    const[posts,setPosts]=useState([])
    const[loading,setLoading]=useState(true);

    useEffect(()=>{
         const feed=async ()=>{
            try {
                const response=await postsService.getAllposts([Query.orderDesc("$createdAt")])
                const postsList=response.documents;
                const mergePosts=[];
                for (const post of postsList) {
                    const profile=await userProfileServ.getUserProfile(post.userId);
                    mergePosts.push({
                        ...post,
                        authorName:post.authorName || "Unknown User",
                        avatarId:profile?.avatarId || null,
                    })

                    
                }
                setPosts(mergePosts);
    
                
            } catch (error) {
                console.log("Error at feed while fetching posts",error);
                
            }finally{
                setLoading(false)
            }
         }
         feed();
    },[]);



    if(loading){
        return <div>Loading feed...</div>
    }
    if(posts.length===0){
        return <div>No posts yet</div>
    }




  return (
    <div className="feed">
        {posts.map((postItem)=>(
            <PostCard
            key={postItem.$id}
            $id={postItem.$id}
            content={postItem.content}
            imageId={postItem.imageId}
            userId={postItem.userId}
             likeCount={postItem.likeCount || 0}
            commentsCount={postItem.commentsCount|| 0}
            authorName={postItem.authorName}
            avatarId={postItem.avatarId}
           

            
            />
           
        ))}
    </div>
  )
}

export default Feed