import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from "axios";

function CoursePage() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState(0);
    const [imageLink, setImageLink] = React.useState("");
    const [published,setPublished] = React.useState(true);
    const [purchased,setPurchased] = React.useState(true);
    const [role,setRole] = React.useState(null);
    
    const { id } = useParams(); // route parameter fetching the variable route value
    const navigate = useNavigate();

    const [username, setUsername] = React.useState(null);
    const token = sessionStorage.getItem("token");

    React.useEffect(() => {
        axios({
            url: `http://localhost:3000/courses/${id}`,
            method: "GET",
            headers: {
                authorization: "Bearer " + token
            },
            responseType: "json"
        })
        .then(res => {
            // console.log(res.data.user);
            // console.log(res.data.purchased);
            setTitle(res.data.course.title);
            setDescription(res.data.course.description);
            setPrice(res.data.course.price);
            setImageLink(res.data.course.imageLink);
            setPublished(res.data.course.published);
            setUsername(res.data.user.username);
            setRole(res.data.user.role);
            setPurchased(res.data.purchased);
        })
        .catch(error => {
            console.log(error.response);
            alert("Forbidden Request! Please Login to continue");
            navigate("/login");
        });
    }, []);
    

    if (username){
        if (role === "admin") return <EditPage 
                                    title={title} 
                                    description={description} 
                                    imageLink={imageLink} 
                                    published={published} 
                                    price={price}
                                    setTitle={setTitle} 
                                    setDescription={setDescription} 
                                    setImageLink={setImageLink} 
                                    setPublished={setPublished} 
                                    setPrice={setPrice}
                                    token={token}
                                    navigate={navigate}
                                    id={id} />

        else if (role === "user") return <PurchasePage
                                    title={title} 
                                    description={description} 
                                    imageLink={imageLink} 
                                    published={published} 
                                    price={price} 
                                    purchased={purchased}
                                    token={token}
                                    navigate={navigate}
                                    id={id} />
    }
}

function PurchasePage(props) {

    const handlePurchase = () => {
        axios({
            url: `http://localhost:3000/users/courses/${props.id}`,
            method: "POST",
            headers: {
                authorization: "Bearer " + props.token
            },
            responseType: "json"
        })
        .then(res => {
            props.navigate("/courses/purchased");
        })
        .catch(err => {
            console.log(err.response.message);
            alert(err.response.message);
        });
    }

    if (props.purchased) return (
        <div>
            <h1>Course Page</h1>
            <br />
            <h2>{props.title}</h2>
            <h3>{props.description}</h3>
            <img src={props.imageLink}></img>
            <br />
        </div>
    );
    else return (
        <div>
            <h1>Course Page</h1>
            <br />
            <h2>{props.title}</h2>
            <h3>{props.description}</h3>
            <img src={props.imageLink}></img>
            <h4>Price- Rs.{props.price}</h4>
            <button onClick={handlePurchase}>Purchase</button>
            <br />
        </div>
    );
}

function EditPage(props){

    const handleEdit = () => {
        axios({
            url: `http://localhost:3000/admin/courses/${props.id}`,
            method: "PUT",
            headers: {
                authorization: "Bearer " + props.token
            },
            data: {
                title: props.title,
                description: props.description,
                price: props.price,
                imageLink: props.imageLink,
                published: props.published
            },
            responseType: "json"
        })
        .then(res => {
            props.navigate("/courses");
        })
        .catch(err => {
            console.log(err.response.message);
            alert(err.response.message);
        });
    }

    return (
        <div>
            <h1>Edit Course Page</h1>
            <br />
            <div><input type={"text"} value={props.title} onChange={e => props.setTitle(e.target.value)} /></div>
            <div><input type={"text"} value={props.description} onChange={e => props.setDescription(e.target.value)} /></div>
            <div><input type={"number"} value={props.price} onChange={e => props.setPrice(e.target.value)} /></div>
            <div><input type={"url"} value={props.imageLink} onChange={e => props.setImagelink(e.target.value)} /></div>
            <FormControlLabel control={<Switch checked={props.published} onChange={e => props.setPublished(e.target.checked)}/>} label="Published" />
            <div><button onClick={handleEdit}>Save</button></div>
        </div>
    );
}

export default CoursePage;