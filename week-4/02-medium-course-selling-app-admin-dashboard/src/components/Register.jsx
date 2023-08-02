import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

/// File is incomplete. You need to add input boxes to take input for users to register.

function Register() {
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [role,setRole] = React.useState("admin");
    const navigate = useNavigate();

    const handleRegister = () => {
        // console.log(`API Route= http://localhost:3000/${role}/signup`);
        axios({
            method:"POST",
            url: `http://localhost:3000/${role}/signup`,
            data:{
                username: email,
                password: password
            },
            responseType: "json",
            
        })
        .then(response => {
            if (response.status != 200){
                alert(response.message);
            }
            else{
                const { message,token } = response.data;
                console.log(message);
                alert(message);
                sessionStorage.setItem('token',token);
                navigate("/login");
            }
        });
    };

    return <div>
        <h1>Register to the website</h1>
        <br />
        Role : <button onClick={() => {setRole("admin")}}>Admin</button><button onClick={() => {setRole("users")}}>User</button>
        <br />
        Email: <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br />
        Password: <input type={"password"} onChange={e => setPassword(e.target.value)}/>
        <br />
        <button onClick={handleRegister}>Register</button>
        <br />
        Already a user? <a href="/login">Login</a>
    </div>
}

export default Register;