import conf from "../conf/conf";
import { Client, ID, Databases, Query } from "appwrite";

export class Likes{
    client=new Client();
    databases;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.databases=new Databases(this.client)
    }

    async likePost(postId,userId){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                ID.unique(),
                {
                    postId,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: LIKESPost :: error", error);
            
        }

    }

    async unlikePost(postId,userId){
        try {

            const response= await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                [
                    Query.equal("postId",postId),
                    Query.equal("userId",userId)
                ]
            );
            if(response.documents.length>0){
                await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                response.documents[0].$id
            )
           
            }
            return true
            
           
        } catch (error) {
            console.log("Appwrite serive :: unlikepost :: error", error);
            return false
            
        }

    }

    async getLikesCountByPost(postId){
        try {
            const response= await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                [Query.equal("postId",postId),
                    Query.limit(100)
                ]
            );
            return response.documents.length
            
        } catch (error) {
            console.log("Appwrite serive :: getLikesbyPost :: error", error);
            return 0;
            
        }

    }

    async checkUserLike(postId,userId){
        try {
            const response=await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                
                    [
                        Query.equal("postId",postId),
                        Query.equal("userId",userId),

                    ]
            )

            return response.documents.length >0 ?response.documents[0]:null;
        } catch (error) {
            console.log("Appwrite serive :: checkuserlike :: error", error);
            
        }




    }

}



const likesService=new Likes();
export default likesService;