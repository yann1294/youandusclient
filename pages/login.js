import { useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";
import { Buffer } from 'buffer/';
import { validateLogin } from "../utils/validation";

//Encryption module
const crypto = require('crypto')
//Sanitizing MongoDB data
const sanitize = require('mongo-sanitize')

//Captcha


export default function Login({publicKey}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  // state
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  // const { user } = state;

  // router
  const router = useRouter();

  useEffect(() => {
    if (user !== null && user.role && !user.role.includes('Admin') && !user.role.includes('Instructor')){
      router.push("/user");
    }else if (user !== null && user.role && user.role.includes('Admin')) {
      router.push('/admin')
    } else if (user !== null && user.role && user.role.includes('Instructor')) {
      router.push('/instructor')
    }else if(user !== null && user.role && !user.role.includes('Admin') && user.role.includes('Instructor')){
      router.push('/instructor')
    } 
    else {
      router.push('/login')
    }
    
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if(validateLogin(email, password)){
        //Sanitize data to prevent MongoDB injection
        email = sanitize(email)
        password = sanitize(password)
        // console.log({email, password})
        const encryptedPassword = encryptPassword({publicKey}, password)            
        
        //Send data to client
        const { data } = await axios.post(`/login`, {
          email,      
          encryptedPassword,        
        },{
          withCredentials: true,
        });
        // console.log("LOGIN RESPONSE", data);
        dispatch({
          type: "LOGIN",
          payload: data,
        });
        // save in local storage
        window.localStorage.setItem("user", JSON.stringify(data));            
      
        // redirect
        if(user.role && user.role.includes('Instructor')){
          router.push('/instructor')
        }else if(user.role && user.role.includes('Admin')){
          router.push('/admin')
        }else{
          router.push("/user");
        }        
      }
      
      // setLoading(false);
    } catch (err) {
      // console.log(err)
      // if(err)
      //   console.log(err)
      // else
      //   toast('An error occurred while submitting the data. Please try later')
      toast(err.response?.data, {autoClose: 8000})
      setLoading(false);
    }
  };


  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />



          <button
            type="submit"
            className="btn btn-block btn-primary"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>

        {/* <p className="text-center pt-3">
          Not yet registered?{" "}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p> */}

        <p className="text-center pt-3">
         
        </p>
      </div>
    </>
  );
};


export async function getServerSideProps(context) {
  const res = await fetch('https://lobster-app-gvavo.ondigitalocean.app/api/get-public-key');
  const {publicKey} = await res.json()
  return {
    props: {publicKey}, // will be passed to the page component as props
  }
}


export function encryptPassword({publicKey}, password){
  //In the code below, the padding is ignored. Password is also converted in buffer
  const encryptedPassword = crypto.publicEncrypt(publicKey, Buffer.from(password))
  
  //The password should be converted to base64 string 
  //to ensure that the data remain intact without modification during transport.
  return encryptedPassword.toString('base64');
}

