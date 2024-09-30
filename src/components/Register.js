import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { name, email, password } = formData;

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            alert(res.data.msg);
            navigate('/')
        } catch (err) {
            console.error(err.response.data.msg);
            alert(err.response.data.msg);
        }
    };

    return (
        <div className="container mt-5 border p-4 rounded shadow" style={{width:'500px'}}>
            <h2 className="text-center">Register</h2>
            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input style={{borderRadius:'5px',height:'40px'}}
                        type="text"
                        className="form-control rounded shadow"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <div  style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'15px'}}>
                <button type="submit" className="btn btn-primary w-100">Register</button>
                <a href='/'>i am already registered</a>
                </div>
            </form>
        </div>
    );
};

export default Register;
