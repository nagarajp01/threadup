import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import  { Logo,Container, LogoutBtn } from '../Index'
import { Link } from 'react-router-dom'
import SearchUsers from '../SearchUsers'

function Header() {
    const user=useSelector((state)=>state.auth.userData)
    const [showHeader,setShowHeader]=useState(true)
    const[lastScrollY,setLastScrollY]=useState(0)


    useEffect(()=>{
        const handleScroll=()=>{
            if(window.scrollY>lastScrollY){
                setShowHeader(false)
            }else{
                setShowHeader(true)
            }
            setLastScrollY(window.scrollY)
        }
        window.addEventListener('scroll',handleScroll)
        return()=>window.removeEventListener('scroll',handleScroll)
    },[lastScrollY])









return (
    <header className={`headerContainer ${showHeader ? 'show':'hide'}`}>
        <Container>
            <nav className='navWrapper'>
                <div className="logoWrapper">
                   <Link to='/all-posts'>
                   <Logo />
                   </Link>
                </div>
                {user && <SearchUsers />}
                <div className="navItems">
                    { user ? (
                        <>
                        <span className='navName'>
                           <Link to={`/profile/${user.$id}`}>
                            {user.name || user.email}
                           
                           </Link>
                        </span>
                       <Link to='/all-posts'> <span className='allposts'>All Posts</span></Link>
                        <Link to='/add-post'><span className='addposts'>Add Post</span></Link>

                        <LogoutBtn />
                        </>
                    ):(
                        <>
                      <Link to='/signup'>
                      <span className='signUp'>SignUp</span>
                      </Link>
                      <Link to='/login'>
                      <span className='login'>Login</span>
                      </Link>
                    
                        </>
                    )}


                </div>
            </nav>

        </Container>

    </header>
  )
}

export default Header