import conf from "../conf/conf";
import { Client, ID, Databases, Query } from "appwrite";

export class Comments{
    client=new Client();
    databases

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.databases=new Databases(this.client)
    }
    async addComment({postId,userId,content}){
        try {

            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                ID.unique(),
                {
                    postId,
                    userId,
                    content
                }
            )
            
        } catch (error) {
            console.log("error in appwrite addcomment",error)
            
        }


    }
    
    async updateComment(commentId,content){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                commentId,
                {
                    content
                }
            )
            
        } catch (error) {
             console.log("error in appwrite updatecomment",error)
            
        }
    }

    async deleteComment(commentId){
        try {
             await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                commentId,
            );
            return true
            
        } catch (error) {
             console.log("error in appwrite deletecomment",error)
             return false
            
        }
    }

    async getCommentsByPost(postId){

        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                [Query.equal("postId",postId)]
            );
        } catch (error) {
             console.log("error in appwrite getcommentcomment",error)
             return false
            
        }
    }





}


const commentService=new Comments();
export default commentService;