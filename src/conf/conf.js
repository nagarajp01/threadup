const conf={

    appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteUserProfileCollectionId:String(import.meta.env.VITE_APPWRITE_USERPROFILE_COLLECTION_ID),
    appwriteCommentsCollectionId:String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID),
    appwriteLikesCollectionId:String(import.meta.env.VITE_APPWRITE_POSTS_LIKES_ID),
    appwritePostsCollectionId:String(import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID)

}




export default conf
