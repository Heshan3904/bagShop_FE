import { useNavigate } from 'react-router-dom';
import { logout, isAdmin } from '../auth';
import logouticon from '../assets/logout.png';
import './admin.css';
import { Link } from 'react-router-dom';
import Navibar from '../components/Navibar';
import AdminDashboard from './AdminDasshboard';


const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      alert('Logout failed: ' + err.message);
    }
  };

  return (
    <>
    <Navibar/>
      <main style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'left', paddingTop: '40px' }}>Welcome to the Admin Dashboard</h1>
        <Link to="/admin/products">
            <button className='adpro'>Manage Products</button>
        </Link>
        
        <AdminDashboard/>
      </main>
    </>
  );
};

export default Admin;