import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import OurNavbar2 from './Navbar/Navbar';
import MyProfile from './pages/MyProfile';
import Search from './pages/Search';

function App() {

  return (
    <div id='main-container'>
      <BrowserRouter >
        <OurNavbar2 />
        <Routes>
          <Route path="/" element ={<Home/>} />
          <Route path="/register" element ={<Register/>} />
          <Route path="/login" element ={<Login/>} />
          <Route path="/home" element ={<Home/>} />
          <Route path="/search" element ={<Search/>} />
          <Route path="/myprofile" element ={<MyProfile/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
