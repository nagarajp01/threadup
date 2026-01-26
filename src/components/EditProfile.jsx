import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import userProfileServ from '../appwrite/userProfiledoc'
import storageService from '../appwrite/fileUpload'
import {Button,Input} from "./Index"

function EditProfile() {
    const [profile,setProfile]=useState(null)
    const [loading,setLoading]=useState(true)
    const {register,handleSubmit,setValue}=useForm()
    const user=useSelector((state)=>state.auth.userData);
    const navigate=useNavigate()
useEffect(()=>{
    if(!user){
        navigate("/login")
    }
},[user,navigate])




    useEffect(() => {
        
            const fetchProfile=async ()=>{
                try {
                    const profileResponse=await userProfileServ.getUserProfile(user.$id);
                if(profileResponse){
                    setProfile(profileResponse)
                    setValue("name",profileResponse.name);
                    setValue("bio",profileResponse.bio || "")
                }
                } catch (error) {
                    console.log("error in edit profile page",error);    
                }finally{
                    setLoading(false)
                }     
        }
        fetchProfile()      
    }, [user.$id,setValue])


    const submit=async(data)=>{
        try {
            if(profile){
                const file=data.avatar && data.avatar[0]?await storageService.uploadFile(data.avatar[0]):null;
                if (file && profile.avatarId){
                    await storageService.deleteFile(profile.avatarId)
                }
                const newUpdatedProfile=await userProfileServ.updateUserProfile(user.$id,{
                    name:data.name,
                    bio:data.bio,
                    avatarId:file?file.$id:profile.avatarId
                })
                if(newUpdatedProfile){
                    navigate(`/profile/${user.$id}`)
                }
            }
            
        } catch (error) {
            console.log("error updating profile",error);
        }

    }

    if(loading){
       return <div>Loading Profile Please Wait......</div>
    }
    if(!profile){
        return <div>Profile not found</div>
    }
  return (
   <div className="editProfilePage">
    <form className='editProfileForm' onSubmit={handleSubmit(submit)}>
         <Input
                label="Full Name"
                placeholder="Enter Your Fullname..."
                {...register("name",{
                    required:true
                })}/>
         <Input
                label="Bio"
                placeholder="Your Bio"
                {...register("bio")}/>
                <Input
                        label="Profile Picture"
                        type="file"
                        accept="image/png,image/jpg,image/jpeg,image/gif"
                        {...register("avatar")}/>

                        <Button type='submit'>
                            Save Changes
                        </Button>



    </form>
   </div>
  )
}

export default EditProfile