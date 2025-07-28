import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase.js';

const ProtectedRoute = ({children}) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return(
        <div className='flex gap-4 max-w-3xl w-full py-3'>
                    <img src="logo.png" alt="" className='h-9 w-9 p-1 rounded-full'/>
                    <div className='loader flex items-center justify-center gap-1'>
                      <div className='w-1 h-1 rounded-full bg-[#9eceff]' style={{animation: 'bounce 1s infinite',}}></div>
                      <div className='w-1 h-1 rounded-full bg-[#9eceff]' style={{animation: 'bounce 1s infinite 0.2s',}}></div>
                      <div className='w-1 h-1 rounded-full bg-[#9eceff]' style={{animation: 'bounce 1s infinite 0.4s',}}></div>
                    </div>
                  </div>
    ) 
  }

  if (!user) {
    return <Navigate to="/" replace />; 
  }

  return children;
}

export default ProtectedRoute