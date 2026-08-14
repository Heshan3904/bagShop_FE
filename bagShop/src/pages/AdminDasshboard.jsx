import { useEffect, useState } from "react";
import Loading from "./Loading";

import { getDashboardStats } from "../services/dashboardService";

import "./admindashboard.css";

export default function AdminDashboard() {

    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);


    const loadDashboard = async () => {

        try{

            const data = await getDashboardStats();

            setStats(data.stats);

        }
        catch(error){

            console.log(error);

            alert("Failed to load dashboard.");

        }
        finally{

            setLoading(false);

        }

    };


    if(loading){

        return (
            <>
            <Loading/>
            </>
        );

    }


    return(

        <div className="dashboard-container">

            <div className="stats-grid">

                <div className="card">

                    <h2>{stats.totalUsers}</h2>

                    <p>Total Users</p>

                </div>

                <div className="card">

                    <h2>{stats.totalProducts}</h2>

                    <p>Total Products</p>

                </div>

                <div className="card">

                    <h2>{stats.totalOrders}</h2>

                    <p>Total Orders</p>

                </div>

                <div className="card">

                    <h2>LKR {stats.totalRevenue}</h2>

                    <p>Total Revenue</p>

                </div>

                <div className="card">

                    <h2>{stats.pendingOrders}</h2>

                    <p>Pending Orders</p>

                </div>

                <div className="card">

                    <h2>{stats.deliveredOrders}</h2>

                    <p>Delivered Orders</p>

                </div>

            </div>

            <div className="dashboard-section">

                <h2>Low Stock Products</h2>

                {

                    stats.lowStockProducts.length===0

                    ?

                    <p>No low stock products.</p>

                    :

                    stats.lowStockProducts.map((product)=>(

                        <div
                            key={product._id}
                            className="list-item"
                        >

                            <span>{product.name}</span>

                            <strong>{product.stock} left</strong>

                        </div>

                    ))

                }

            </div>


            <div className="dashboard-section">

                <h2>Recent Orders</h2>

                {

                    stats.recentOrders.map((order)=>(

                        <div
                            key={order._id}
                            className="list-item"
                        >

                            <span>

                                {order.user?.name}

                            </span>

                            <span>

                                LKR {Number(order.totalPrice || 0).toFixed(2)}

                            </span>

                            <span>

                                {order.orderStatus}

                            </span>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}