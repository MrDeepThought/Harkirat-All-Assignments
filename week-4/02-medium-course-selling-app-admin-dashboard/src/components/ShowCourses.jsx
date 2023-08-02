import React, { useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";

function ShowCourses() {
    const [isAuthenticated,setIsAuthenticated] = React.useState(false);
    const [courses,setCourses] = React.useState([]);
    const navigate = useNavigate();

    let token = sessionStorage.getItem('token');
    let role;
    if (token){
        role = sessionStorage.getItem("role");
    }else role = "admin"; // default role

    React.useEffect(() => {
        axios({
            method: "GET",
            url: `http://localhost:3000/${role}/courses`,
            headers:{
                authorization: "Bearer "+ token
            },
            responseType: "json"
        }).
        then(response => {
            if (response.status == 200){
                setIsAuthenticated(true);
                setCourses(response.data.courses);
            }
        })
        .catch(error => {
            console.log(error.response);
            alert("Forbidden Request! Please Login to continue");
            setIsAuthenticated(false);
            navigate("/login");
        });
    }, []);

    if (isAuthenticated){
        return (
            <div>
                <h1>All Courses Page</h1>
                <span> Create a new course from <Link to={"/create"}>Here</Link></span>
                {courses.map(c =>{
                    return <Course 
                    key={c.id} 
                    title={c.title} 
                    imageLink={c.imageLink} 
                    description={c.description} 
                    price={c.price} 
                    id={c.id} 
                    role={role} />
                })}
            </div>  
        );
    }
} 

function Course(props) {
    const navigate = useNavigate();

    if (props.role === "admin") 
        return (
        <div>
            <h2>{props.title}</h2>
            <img src={props.imageLink}></img>
            <h4>Price- Rs.{props.price}</h4>
            <button onClick={() => navigate(`/courses/${props.id}`)}>Edit</button>
            <br />
        </div>
        );
    else
        return (
            <div>
            <h2>{props.title}</h2>
            <Link to={`/courses/${props.id}`}>
                <img src={props.imageLink}></img>
            </Link>
            <h4>Price- Rs.{props.price}</h4>
            <br />
        </div>
        );
}

export default ShowCourses;