import conf from "../conf/conf";
import { Client, Databases, ID, Query, Storage } from "appwrite";
export class userProfileService{
    client = new Client();
    databases;
    bucket;

    constructor (){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);
    }

    async createUserProfile({userId,username,name,bio,avatarId}){
    try {
       
             return await this.databases.createDocument(
            
                conf.appwriteDatabaseId,
                conf.appwriteUserProfileCollectionId,
                ID.unique(),
                {
                    userId,
                    username,
                    name,
                    bio,
                    avatarId,
                }


        
        )

    } catch (error) {
       if(error.code===409){
        console.log("profile already exists")
        return await this.getUserProfile(userId)
       }
       throw error
        
    }

    }
    
    async updateUserProfile(userId,{name,bio,avatarId}){
        try {
            const profile=await this.getUserProfile(userId);
            if(!profile) throw new Error("profile not found")
            return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteUserProfileCollectionId,
            profile.$id,
            {
                name,
                bio,
                avatarId,

            }    
            )
            
        } catch (error) {
            console.log("error in updating post",error)
            
        }

    }

    async getUserProfile(userId){
        try {
            const result= await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserProfileCollectionId,
                [Query.equal("userId",userId)]
            )
            return result.documents.length >0 ?result.documents[0] : null
            

            
        } catch (error) {
            console.log("userprofile serive :: getuserprofile :: error", error);
            throw error
            
        }
    }

    async searchUsers(searchText){
        try {
            if(!searchText) return [];
            const result=await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserProfileCollectionId,
                [
                    Query.search("name",searchText),
                    Query.limit(10)
                ]
            )
            return result.documents
        } catch (error) {
            console.log("userProfile fetching error",error)
            return[]
            
        }
    }
    


}



const userProfileServ=new userProfileService();
export default userProfileServ