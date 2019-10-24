import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { getPurchaseHistory } from './apiUser';
const {
    user: { _id, name, email, role },
    token
} = isAuthenticated();

const UserDashBoard = props => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const init = (userId, token) => {
            getPurchaseHistory(userId, token).then(res => {
                if (res.error) {
                    console.log(res.err);
                } else {
                    setHistory(res);
                }
            });
        };
        init(_id, token);
    }, []);

    const userLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/cart">
                            My Cart
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to={`/profile/${_id}`}>
                            Update Profile
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };

    const userInfo = () => (
        <div className="card mb-5">
            <h3 className="card-header">User Information</h3>
            <ul className="list-group">
                <li className="list-group-item">{name}</li>
                <li className="list-group-item">{email}</li>
                <li className="list-group-item">
                    {role === 1 ? 'Admin' : 'Registered User'}
                </li>
            </ul>
        </div>
    );

    // console.log(history);

    const purchaseHistory = history => (
        <div className="card md-5">
            <h3 className="card-header">Purchase History</h3>
            <ul className="list-group">
                <li className="list-group-item">
                    {history.map((order, oIndex) => (
                        <div key={oIndex}>
                            {oIndex === 0 ? null : <hr />}
                            {order.products.map((product, pIndex) => (
                                <div key={pIndex}>
                                    <h6>Product name: {product.name}</h6>
                                    <h6>Product price: {product.price}</h6>
                                    <h6>Purchased date: {product.createdAt}</h6>
                                </div>
                            ))}
                        </div>
                    ))}
                </li>
            </ul>
        </div>
    );

    return (
        <Layout
            title="Dashboard"
            description={`G'day ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">{userLinks()}</div>
                <div className="col-9">
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
    );
};

export default UserDashBoard;
