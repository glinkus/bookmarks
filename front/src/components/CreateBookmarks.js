import React, { useState, useEffect } from "react";
import { GetRequestWithToken } from "../functions/GetRequestWithToken";
import { PostRequestWithToken } from "../functions/PostRequestWithToken";
import { useNavigate } from "react-router-dom";

const CreateBookmark = ({workspaceId,onBookmarkCreated}) => {
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [formData, setFormData] = useState({
        url: "",
        title: "",
        status: "active",
    })
    const [loading, setLoading] = useState(true);
    

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

        fetchTags()
    }, [navigate])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleTagSelect = (tagId) => {
        setSelectedTags((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                tags: selectedTags,
                workspace: workspaceId, 
            };
            const response = await PostRequestWithToken(navigate, "/api/bookmarks/", data);

            if (onBookmarkCreated) {
                onBookmarkCreated(response);
            }
            setFormData({ url: "", title: "", status: "active" })
            setSelectedTags([]);
        } catch (e) {
            console.error(e);
        }
    }

    if (loading) {
        return <p>Kraunama..</p>;
    }

    return (
        <div>
            <h3>Sukurti URL žymą</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>URL:</label>
                    <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="URL.."
                        required
                    />
                </div>
                <div>
                    <label>Pavadinimas:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Pavadinimas"
                        required
                    />
                </div>
                <div>
                    <label>Statusas:</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="active">Aktyvi</option>
                        <option value="redirect">Nukreipianti</option>
                        <option value="dead">Mirus</option>
                    </select>
                </div>
                <div>
                    <label>Žymos:</label>
                    <ul>
                        {tags.map((tag) => (
                            <li key={tag.id}>
                                <input
                                    type="checkbox"
                                    checked={selectedTags.includes(tag.id)}
                                    onChange={() => handleTagSelect(tag.id)}
                                />
                                {tag.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Sukurti</button>
            </form>
        </div>
    )
}

export default CreateBookmark;
