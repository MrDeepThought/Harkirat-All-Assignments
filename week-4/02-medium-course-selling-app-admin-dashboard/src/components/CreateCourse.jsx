import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState(0);
    const [imageLink, setImagelink] = React.useState("");
    const navigate = useNavigate();

    const [isAuth,setIsAuth] = React.useState(false);
    const [username,setUsername] = React.useState(null);
    const [role,setRole] = React.useState(null);
    const token = sessionStorage.getItem("token");

    React.useEffect(() => {
        axios({
            url: "http://localhost:3000/authenticate",
            method: "GET",
            headers: {
                authorization: "Bearer " + token
            },
            responseType: "json"
        })
        .then( response => {
            setUsername(response.data.user.username);
            setRole(response.data.user.role);
            setIsAuth(true);
        })
        .catch(error => {
            console.log(error.response);
            alert("Forbidden Request! Please Login to continue");
            navigate("/login");
        });

    }, []);

    const handleCreate = () => {
        axios({
            url: "http://localhost:3000/admin/courses",
            method: "POST",
            headers: {
                authorization: "Bearer " + token
            },
            data: {
                title: title,
                description: description,
                price: price,
                imageLink: imageLink,
                published: true
            },
            responseType: "json"
        })
        .then(response => {
            console.log(response.data.message, response.data.courseId);
            alert(`Course with course ID ${response.data.courseId} created successfully!`);
            navigate("/courses")
        })
    };

    if (isAuth){
        return (
            <div>
                <h1>Create Course Page</h1>
                <br />
                <div><input type={"text"} placeholder="Title" onChange={e => setTitle(e.target.value)} /></div>
                <div><input type={"text"} placeholder="Description" onChange={e => setDescription(e.target.value)} /></div>
                <div><input type={"number"} placeholder="Price" onChange={e => setPrice(e.target.value)} /></div>
                <div><input type={"url"} placeholder="Imagelink" onChange={e => setImagelink(e.target.value)} /></div>
                <div><button onClick={handleCreate}>Create</button></div>
            </div>
        );  
    }
}
export default CreateCourse;