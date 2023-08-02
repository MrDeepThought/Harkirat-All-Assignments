import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import CoursePage from './components/CoursePage'
import Appbar from './components/Appbar';
import PurchasedCourses from './components/PurchasedCourses'

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
    return (
        <Router>
            <Appbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create" element={<CreateCourse />} />
                <Route path="/courses" element={<ShowCourses />} />
                <Route path="/courses/:id" element={<CoursePage />} />
                <Route path="/courses/purchased" element={<PurchasedCourses />} />
            </Routes>
        </Router>
    );
}

export default App;