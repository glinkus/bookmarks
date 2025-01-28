import React, { useState, useEffect } from "react";
import { GetRequestWithToken } from "../functions/GetRequestWithToken";
import { PostRequestWithToken } from "../functions/PostRequestWithToken";
import { useNavigate } from "react-router-dom";

const TagsPage = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [tagName, setTagName] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await GetRequestWithToken(navigate, "/api/tag/");
                setTags(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchTags();
    }, [navigate])

    const handleCreateTag = async (e) => {
        e.preventDefault();
        try {
            const newTag = await PostRequestWithToken(navigate, "/api/tag/", { name: tagName });
            setTags((prevTags) => [...prevTags, newTag]);
            setMessage(`Žyma "${newTag.name}" sukurta`);
            setTagName("");
        } catch (e) {
            console.error(e)
        }
    }

    if (loading) {
        return <p>Krauna, palauk truputį</p>;
    }

    return (
        <div>
            <h2>Žymos</h2>
            <ul>
                {tags.map((tag) => (<li key={tag.id}>{tag.name}</li>))}
            </ul>
            <h3>Sukurti naują</h3>
            <form onSubmit={handleCreateTag}>
                <input
                    type="text"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="pavadinimas.."
                    required
                />
                <button type="submit">Sukurti</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={() => navigate(-1)}>Grįžti</button>
        </div>
    )
}

export default TagsPage;
