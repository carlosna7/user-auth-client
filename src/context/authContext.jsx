'use client'

import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [ auth, setAuth ] = useState(false)
  const [ userToken, setUserToken ] = useState(null)

  const router = useRouter()

  // Fazer tanto com cookies ou localstorage/sectionStorage
  useEffect(() => {
    const cookies = Cookies.get('tokenLogin')
    console.log(cookies)

    if(cookies) {
      setUserToken(cookies)
    } else {
      setUserToken(null)
    } 
  }, [])

  useEffect(() => {
	
    const verifyToken = async () => {

      if(userToken) {
        try {

          // https://user-auth-server-carlosna7.vercel.app/verifyuser
          // http://localhost:3001/verifyuser
          const response = await axios.post("https://user-auth-server-carlosna7.vercel.app/verifyuser", {
            token: userToken
          })
  
          console.log(response.data.msg)
  
          if(response.data.success === true) {
            console.log("true verdade")
            setAuth(true)
          } else {
            console.log("false falso")
            setAuth(false)
  
            router.push("/login")
          }
        } catch (error) {
          console.log("Erro ao verificar token:", error)
        }
      }
      
    }

    verifyToken()
  }, [userToken])

  return (
    <AuthContext.Provider value={{ auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider }
