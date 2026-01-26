import conf from "../conf/conf";
import { Client, ID, Databases, Query } from "appwrite";


export class PostsService{

    client=new Client();
    databases;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.databases=new Databases(this.client)
    }

    async createPost({content,imageId,userId,authorName}){
        try {
            console.log("author name recievd",authorName)
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwritePostsCollectionId,
                ID.unique(),
                {
                    content,
                    imageId,
                    userId,
                    authorName,
                    commentsCount:0,

                }
            )
            
        } catch (error) {
            console.log("error in create postsservice",error)
            
        }

    }

    async updatePost(postId,{content,imageId,commentsCount}){
            try {
                const data={}
                if(content !==undefined) data.content=content;
                if(imageId !==undefined) data.imageId=imageId;
                if(commentsCount !==undefined) data.commentsCount=commentsCount;
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwritePostsCollectionId,
                    postId,
                    data
                )
                
            } catch (error) {
                console.log("Appwrite serive :: updatePost :: error", error);
                
            }


    }

    async deletePost(postId){
        try {

            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwritePostsCollectionId,
                postId
            )
            return true
            
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(postId){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwritePostsCollectionId,
                postId
            )
            
        } catch (error) {

            console.log("Appwrite serive :: getPost :: error", error);
            return false
            
        }
    }

    async getAllposts(queries=[]){
        try {

            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwritePostsCollectionId,
                queries
            )
            
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
            
        }




    }

    async getPostsByUser(userId,queries=[]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwritePostsCollectionId,
                [
                    Query.equal("userId",userId),
                    Query.orderDesc("$createdAt"),
                    ...queries
                ]
            )


            
        } catch (error) {

            console.log("Appwrite serive :: getPosts :: error", error);
            return false
            
        }


    }




}


const postsService=new PostsService()
export default postsService