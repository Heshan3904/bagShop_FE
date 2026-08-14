
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navibar.css';

import userIcon from '../assets/user.png';
import logouticon from '../assets/logout.png';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Navibar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {user, isLoggedIn, logout} = useAuth();
  

  const handleLogout =  () => {
    logout();
    navigate('/');
  };



  return (
    <nav className="navbar">

      <Link to="/">
        <img src={logo} className='logo' alt="" />
      </Link>

      <div className="nav-links">
        <a href="/">Home</a>
        <Link to="/" >Categories</Link>
        <a href="/about">About</a>
        
        {
          isLoggedIn && user?.role === "user" &&(
            <Link to="/cart">Cart</Link>

          )
        }
        {
          isLoggedIn && user?.role === "user" && (
            <Link to="/my-orders">Orders</Link>
          )
        }
        
        {user?.role === "admin" && (
          <Link to="/admin/orders">Orders</Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin">Dashboard</Link>
        )}
      </div>

      {isLoggedIn ? (
        <div
        style={{
          display: "flex",
          alignItems: "center",
          gap:"15px",
        }}>
          <span
          style={{
            color: "#333",
            fontWeight: "600",
          }}>
            Hi,{user?.name}
          </span>
          <img
          src={logouticon}
          alt='Logout'
          style={{cursor: "pointer"}}
          onClick={handleLogout}/>
        </div>

      ):(
        <Link to = "/signin">
          <img 
          src={ userIcon } 
          alt="User" 
          style={{cursor: "pointer"}}
          />
        </Link>
      )}
    </nav>
  );
};

export default Navibar;
