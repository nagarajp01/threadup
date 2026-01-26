import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login as authLogin } from "../store/authSlice";
import Logo from './Logo';
import Input from './Input';
import Button from './Button';
import userProfileServ from '../appwrite/userProfiledoc';

const SignUp = () => {
    const [error,setError]=useState("");
    const{register,handleSubmit}=useForm();
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const create=async (data)=>{
        setError("")
       try {




         await authService.createAccount(data);
         await authService.login({
            email:data.email,
            password:data.password,
         })




           const userData=await authService.getCurrentUser();
           if(!userData) throw new Error("User not logged in")
     
            
             try {
                 const newUserProfile=await userProfileServ.createUserProfile({
                    userId:userData.$id,
                    username:userData.name.toLowerCase().replace(/\s+/g,'_'),
                    name:userData.name,
                    bio:"",
                    avatarId:null
                })
                console.log("NEW USER PROFILE CREATION IN SIGNUP PAGE",newUserProfile)
               } catch (error) {
                console.log("Pofile creation  error",error);
                
                
               }
        
        dispatch(authLogin({userData}))
            navigate("/all-posts")
 } catch (error) {
        setError(error.message)
        
       }
    }
  return (
    <div className="loginWrapper">
    <div className="innerLoginwrap">
        <div className="logoWrap">
        <span>
            <Logo width='32px' />
        </span>
        </div>
        <h2 className='signInHeader'>Sign up to Create Account</h2>
        <p className='haveAcpara'> Already have an account?&nbsp;
            <Link to="/login">
            Sign In
        
        </Link>   </p>
        {error && <p className='errorPara'>{error}</p>}
        <form className='formWrapper' onSubmit={handleSubmit(create)}>
            <div className="innerForm">
                <Input
                label="Full Name: "
                placeholder="Enter Your Full Name"
                {...register("name",{
                    required:true,
                })}
                />

                <Input label="Email"type="email"
                placeholder="Enter Your Email"
                {...register("email",{
                    required:true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                <Input
                label="Password"
                type="password"
                placeholder="Enter Your Password"
                {...register("password",{
                    required:true,
                    minLength:{
                        value:8,
                        message:"Password must be atleast 8 characters"
                    }
                })}
                />
                <Button className='signInBtn' type='submit'>Create Account</Button>



            </div>



        </form>
    </div>
   </div>
    
  )
}

export default SignUp