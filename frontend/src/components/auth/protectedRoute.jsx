import api from '@/lib/apiClient';
import { useAuthStore } from '@/lib/store/authStore'
import { useQuery } from '@tanstack/react-query';
import { Loader2, LoaderCircle } from 'lucide-react';
import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router';

const ProtectedRoute = ({children}) => {

    const {user, setAuth,clearAuth,token } = useAuthStore();

    const location = useLocation();


    const {data, isError ,isLoading, isSuccess, error} = useQuery({
        queryKey:["currentUser"],
        queryFn: async()=>{
            const response = await api.get("/auth/me",{
              
            })

            return response.data;
        } ,
        retry:1
    });


    useEffect(()=>{
        if(isError){
           clearAuth();
        }
    },[error,isError,clearAuth]);

    useEffect(()=>{
        if(isSuccess && data){
            setAuth(data,token)
        }
    },[setAuth,isSuccess,data,token]);

    if(isLoading){
       return( <div className='h-screen flex justify-center items-center'>
            <LoaderCircle  className='animate-spin'/>
        </div>
       )
    }

    if(isError){
        return <Navigate to="/login" state={{from:location}} replace  />
    }
    if(!user){
        return <Navigate to="/login" state={{from:location}} replace  />
    }

  return children
}

export default ProtectedRoute
