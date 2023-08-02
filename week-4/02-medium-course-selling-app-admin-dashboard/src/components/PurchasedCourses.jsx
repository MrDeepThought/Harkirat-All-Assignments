import React from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";

function PurchasedCourses() {
    const [isAuthenticated,setIsAuthenticated] = React.useState(false);
    const [courses,setCourses] = React.useState([]);
    const navigate = useNavigate();

    let token = sessionStorage.getItem('token');

    React.useEffect(() => {
        axios({
            method: "GET",
            url: `http://localhost:3000/users/purchasedCourses`,
            headers:{
                authorization: "Bearer "+ token
            },
            responseType: "json"
        })
        .then(response => {
            if (response.status == 200){
                setIsAuthenticated(true);
                setCourses(response.data.purchasedCourses);
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
                <h1>Purchased Course Page</h1>
                {courses.map(c =>{
                    return <Course 
                    key={c.id} 
                    title={c.title} 
                    imageLink={c.imageLink} 
                    id={c.id} />
                })}
            </div>  
        );
    }
} 

function Course(props) {

    return (
    <div>
        <h2>{props.title}</h2>
        <Link to={`/courses/${props.id}`}>
            <img src={props.imageLink} />
        </Link>
        <br />
    </div>
    );
}

export default PurchasedCourses;