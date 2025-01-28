import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostRequest } from "../functions/PostRequest";

function RegisterPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const data = await PostRequest(navigate, "/api/register/", formData)
            if(data.message == "new user created") {
                alert("Registracija sėkminga, prisijunkite");
                navigate("/")
            } else {
                alert(data.error)
            }
        }
        catch(error) {
            console.error(error);
        }
    }
    return (
        <div>
            <form className="login" onSubmit={handleSubmit}>
                <div>
                    <label>Slapyvardis:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div>
                    <label>Slaptažodis:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <p></p>
                <button type="submit">Registruotis</button>
            </form>
        </div>
    )
}
export default RegisterPage