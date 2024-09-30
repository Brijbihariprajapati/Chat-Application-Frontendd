import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData;

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            alert(res.data.msg);
            localStorage.setItem('email',res.data.userexist.email)
            localStorage.setItem('userId',res.data.userexist._id)
            localStorage.setItem('name',res.data.userexist.name)
            
            navigate('/chat')
        } catch (err) {
            console.error(err.response.data.msg);
            alert(err.response.data.msg);
        }
    };

    return (
        <div className="container mt-5 rounded shadow" style={{width:'500px'}}>
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleSubmit} className=" p-4 ">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
               <div style={{display:'flex',alignItems:'center',justifyContent:"space-evenly", flexDirection:'column',gap:'15px'}}>
               <button type="submit" className="btn btn-primary w-100">Login</button>
               <a href='/register'>i have no account</a>
               </div>
            </form>
        </div>
    );
};

export default Login;
