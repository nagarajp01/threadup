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



function Login() {
    const[error,setError]=useState("");
    const dispatch=useDispatch();
    const {register,handleSubmit}=useForm()
    const navigate=useNavigate()

    const login=async (data)=>{
        setError("");
        try {
            const session=await authService.login(data);
            if(session){
                const userData=await authService.getCurrentUser();
                if(userData){
                    dispatch( authLogin({userData}));
                     navigate("/all-posts")
                }
               
                

            }
            
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
        <h2 className='signInHeader'>Sign into Your Account</h2>
        <p className='haveAcpara'> Don&apos;t have any account?&nbsp; 
            <Link to="/signup">
            Sign Up
        
        </Link>   </p>
        {error && <p className='errorPara'>{error}</p>}
        <form className='formWrapper' onSubmit={handleSubmit(login)}>
            <div className="innerForm">
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
                })}
                />
                <Button className='signInBtn' type='submit'>Sign In</Button>



            </div>



        </form>
    </div>
   </div>
  )
}

export default Login