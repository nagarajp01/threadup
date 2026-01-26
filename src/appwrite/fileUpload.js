import conf from "../conf/conf";
import { Client, Storage, ID } from "appwrite";


export class StorageService{
    client=new Client();
    bucket;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.bucket=new Storage(this.client);
    }

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return null;

            
        }

    }

    async deleteFile(fileId){
       try {
         await this.bucket.deleteFile(
            conf.appwriteBucketId,
            fileId
        )
        return true
        
       } catch (error) {
        console.log("Appwrite serive :: deleteFile :: error", error);
        return false

        
       }
    }

    async getFilePreview(fileId){
        try {
            return  await this.bucket.getFileView(
                conf.appwriteBucketId,
                fileId
            )
            
        } catch (error) {
            console.log("Appwrite serive :: filepreview :: error", error);
            return null;
            
        }
    }

    
    
}





const  storageService=new StorageService()

export default storageService;