import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice'
import authService from './appwrite/auth';
import Header from './components/Header/Header';
import { Routes,Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Feed from './components/Feed';
import PostForm from "./components/PostForm/PostForm"
import PostDetail from './components/PostDetail';
import Profile from "./components/Profile"
import EditProfile from './components/EditProfile';
import ProtectedRoute from './components/ProtectedRoute';
import EditPost from './components/EditPost';

function App() {
  const[loading,setLoading]=useState(true);
  const dispatch=useDispatch();
  useEffect(() => {
    authService.getCurrentUser().then((userData)=>{
      if(userData){
        dispatch(login({userData}))
      }else{
        dispatch(logout())
      }
    })
    .finally(()=> setLoading(false))
  }, [])
  return !loading ? (

    <div className="appContainer">
      <div className="innerAPP">
        <Header />
        <div className="main">
         <Routes>
          <Route path='/' element={<ProtectedRoute>
            <Navigate to={"/all-posts"} />
          </ProtectedRoute>} />




          <Route path='/all-posts' element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }/>          
          <Route path='/login' element={<Login />}/>          
          <Route path='/signup' element={<SignUp />}/>          
          <Route path='/add-post' element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          }/>          
          <Route path='/post/:id' element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }/>          
          <Route path='/profile/:userId' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }/>    
          <Route path='/edit-profile' element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }/>    
          <Route path='/edit-post/:id' element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          } />
  
    
            


         </Routes>
        </div>
      </div>
      {/*Footer */}
    </div>
  ):null
}

export default App
