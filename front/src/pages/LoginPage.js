import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [formData, setFormData] = useState({username: "", password: ""});
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        setErrors({ ...errors, [e.target.name]: "" });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(formData),
            })
            const data = await response.json();
            if(response.ok) {
                localStorage.setItem("refresh", data.refresh);
                navigate("/dashboard");
            } else{
                if(response.status == "401"){
                    alert(data.detail)
                }
                setErrors(data);
            }
        } catch(error) {
            console.error(error);
        }
    }
    return (
        <div>
            <form className="login" onSubmit={handleSubmit}>
                <div>
                    <label>Slapyvardis:</label>
                    <input
                        type="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className="error">{errors.username[0]}</p>}
                </div>
                <div>
                    <label>Slaptažodis: </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="error">{errors.password[0]}</p>}
                </div>
                <p></p>
                <button type="submit">Prisijungti</button>
            </form>
            <div>
                <button type="register" onClick={() => {navigate("/register")}}>Registruotis</button>
            </div>
        </div>
    )
}
export default LoginPage;