import React from 'react'
import { useAuthStore } from '../store/authStore';
import { CiSettings } from "react-icons/ci";
import { AiOutlineUser } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { AuthUser,logout } = useAuthStore();
  const navigate = useNavigate() 

  return (
    <div className='navbar border-b-2 bg-base-100 border-neutral-600 h-12 overflow-x-hidden'> 
      
      <div className='lg:px-40 px-2 h-full flex items-center justify-between w-full'> 
        
        <div onClick={()=>{navigate("/")}} className='flex cursor-pointer items-center'>
          <img src="/chaticon.png" className='size-10 ' alt="Chattify Logo" />
          <span className='hover:font-bold text-base-content transition-all duration-1000 text-xl font-semibold'>
                Chattify
            </span>
        </div>

        {!AuthUser ?
          <div className='flex items-center sm:space-x-4 justify-between'>
            <button onClick={()=>{navigate("/setting")}} className='btn btn-ghost btn-sm sm:py-1'>
              <span className='text-xl'><CiSettings /></span>
              <h1 className='md:block hidden'>Setting</h1>
            </button>

            <button onClick={()=>{navigate("/signup")}} className='btn btn-primary btn-sm'>
              <span className='text-xl'><FaRegCircleUser /></span>
              <span>Sign up</span>
            </button>
          </div>
          :
          <div className='flex items-center sm:space-x-4 justify-between'>
            <button onClick={()=>{navigate("/profile")}} className='btn btn-ghost btn-sm'>
              <span className='text-xl'><AiOutlineUser /></span>
              <span className='hidden sm:block'>Profile</span>
            </button>

            <button onClick={()=>{navigate("/setting")}} className='btn btn-ghost btn-sm'>
              <span className='text-xl'><CiSettings /></span>
              <span className='hidden sm:block'>Settings</span>
            </button>
            
            <button onClick={()=>{logout()}} className='btn btn-ghost btn-sm'>
              <span className='text-xl'><CiLogin /></span>
              <span className='hidden sm:block'>Logout</span>
            </button>

          </div>
        }
      </div>
    </div>
  )
}

export default Navbar