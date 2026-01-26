import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userProfileServ from '../appwrite/userProfiledoc'
import Input from './Input'
import storageService from '../appwrite/fileUpload'

function SearchUsers() {

    const[query,setQuery]=useState("")
    const[result,setResult]=useState([])
    const[loading,setLoading]=useState(false)


    useEffect(()=>{
        const delay=setTimeout( async () => {
            if(!query.trim()){
                setResult([])
                return
            }
            setLoading(true)
            const user=await userProfileServ.searchUsers(query)
            const usersWithAvatars=await Promise.all(
                user.map(async(userItem)=>(
                    {
                        ...userItem,
                        avatarUrl:userItem.avatarId ? await storageService.getFilePreview(userItem.avatarId):null
                    }
                ))
            )
            setResult(usersWithAvatars)
            setLoading(false)
        }, 400);

        return ()=>clearTimeout(delay)
    },[query])



  return (
    <div className="searchBox">
        <Input
        placeholder="Search Username here..."
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        className="search-Input"
        />
        {loading && <p>Searching......</p>}
       {result.length >0 &&(
        <div className="search-results">
             {result.map((user)=>{
                return(
                    <Link key={user.$id} to={`/profile/${user.userId}`} className='search-user'>
                <img src={user.avatarUrl} alt="avatar" className='search-avatar'  onError={(e)=>console.log(e.target.src)}/>
                <div className="search-user-info">
                    <p className='search-name'>@{user.username}</p>
                <p className='search-username'>{user.name}</p>
                </div>
            </Link>
                )
             })}
        </div>


       )}

    </div>
    



  )
}

export default SearchUsers