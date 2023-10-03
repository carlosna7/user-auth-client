'use client'

import jwt from "jsonwebtoken";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

const Homelogged = () => {

  const router = useRouter()
  const searchParams = useSearchParams();  
  const queryToAuth = searchParams.get('query');
  console.log(queryToAuth)

  const getData = () => {

    const token = getCookie("token");

    axios.post("http://localhost:3001/homelogged", { 
      // token: token,
      email: queryToAuth,
    }, {
      withCredentials: true,
    }).then((response) => {
      alert(response.data.msg)
      console.log(response)
    }).catch((error) => {
      console.log("Axios erro: ", error)
    })
  }

  const getCookie = (name) => {
    const cookie = {};
    console.log(cookie)
    
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
  
    return cookie[name];
  }

  const isAuthenticated = () => {
    const token = getCookie("token");
    console.log(token)
  
    if(!token) {
      console.log("Token invalido ou vazio")
      return false;
    }
  
    try {
      // Verify the JWT token on the client-side
      const decodedToken = jwt.decode(token)
      const decodedEmail = decodedToken.email
      console.log(decodedEmail)
      
      if(decodedEmail === queryToAuth ) {
        return true;
      }

    } catch (error) {
      console.log("Erro na descriptografação")
      return false;
    }
  }

  useEffect(() => {
    getData();

    if(isAuthenticated()) {
      console.log("autenticado")
    } else {
      router.push("/login")
      console.log("não autenticado")
    }
  }, []);

  return (
    <div>
      <p>Parabéns, você está logado!</p>
  </div>
  )
}

export default Homelogged