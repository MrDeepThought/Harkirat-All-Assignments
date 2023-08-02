import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [role,setRole] = React.useState("admin");
    const navigate = useNavigate();

    const handleLogin = () => {
        axios({
            method: "POST",
            url: `http://localhost:3000/${role}/login`,
            headers:{
                username: email,
                password: password
            },
            responseType: "json",
            
        })
        .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                const { message,token } = response.data;
                console.log(message);
                // alert(message);
                sessionStorage.setItem('token',token);
                sessionStorage.setItem('role',role);
                // navigate("/courses");
                window.location = "/courses";
            }
        })
        .catch(error => {
            console.log(error);
            alert("Forbidden request!");
        })
    };

    return <div>
        <h1>Login to admin dashboard</h1>
        <br />
        Role : <button onClick={() => {setRole("admin")}}>Admin</button><button onClick={() => {setRole("users")}}>User</button>
        <br/>
        Email: <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br />
        Password: <input type={"password"} onChange={e => setPassword(e.target.value)}/>
        <br/>
        <button onClick={handleLogin}>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;