import { create } from "zustand";
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(

        (set,get) =>({

            user:null,
            token:null,
            isAuthenticated:false,

            setAuth:(userData,token) => set({
                user:userData,
                token,
                isAuthenticated:true
            }),

            clearAuth:()=> set({
                user:null,
                token:null,
                isAuthenticated:false
            }),

            getToken:()=> get().token

        }),
        {
            name:"auth-storage",
            partialize:(state) =>({
                user:state.user,
                token:state.token,
                isAuthenticated:state.isAuthenticated
            })
        }
        
    ),
    
)