import React, { useState, useEffect } from "react";
import { GetRequestWithToken } from "../functions/GetRequestWithToken";
import { PostRequestWithToken } from "../functions/PostRequestWithToken";
import { useNavigate } from "react-router-dom";

const Bookmarks = ({ workspaceId, bookmarks, setBookmarks }) => {
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [editingBookmark, setEditingBookmark] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        status: "active",
        tags: [],
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryParams = [{ name: "workspace_id", value: workspaceId }];
                const bookmarkData = await GetRequestWithToken(navigate, "/api/bookmarks/", queryParams);
                setBookmarks(bookmarkData);

                const tagData = await GetRequestWithToken(navigate, "/api/tag/");
                setTags(tagData)
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [navigate, workspaceId])

    const handleDelete = async (id) => {
        try {
            await PostRequestWithToken(navigate, `/api/bookmarks/${id}/`, {}, "DELETE");
            setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
            setMessage(`Sėkmingai ištrinta žyma`);
        } catch (e) {
            console.error(e);
            setMessage("Susidūrėme su klaida :(");
        }
    }

    const handleEdit = (bookmark) => {
        setEditingBookmark(bookmark.id);
        setFormData({
            title: bookmark.title,
            url: bookmark.url,
            status: bookmark.status,
            tags: bookmark.tags.map((tag) => tag.id),
        })
    }
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedBookmark = {
                ...formData,
                tags: formData.tags,
                workspace: workspaceId,
            };
            console.log(updatedBookmark)

            const response = await PostRequestWithToken(
                navigate,
                `/api/bookmarks/${editingBookmark}/`,
                updatedBookmark,
                "PUT"
            )

            setBookmarks((prev) =>
                prev.map((bookmark) => bookmark.id === editingBookmark ? response : bookmark)
            );

            setMessage(`Žyma "${response.title}" atnaujinta`);
            setEditingBookmark(null);
        } catch (e) {
            console.error(e);
            setMessage("Susidūrėme su klaida :(");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleTagChange = (tagId) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter((id) => id !== tagId)
                : [...prev.tags, tagId],
        }))
    }

    const handleCancelEdit = () => {
        setEditingBookmark(null);
        setFormData({ title: "", url: "", status: "active", tags: [] });
    }

    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(bookmarks, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "bookmarks.json";
        link.click();
    }

    const handleImportBookmarks = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const importedBookmarks = JSON.parse(text);
    
            for (const bookmark of importedBookmarks) {
                const payload = {
                    ...bookmark,
                    tags: bookmark.tags.map(tag => tag.id),
                    workspace: workspaceId,
                }
                await PostRequestWithToken(navigate, "/api/bookmarks/", payload);
            }
            const queryParams = [{ name: "workspace_id", value: workspaceId }];
            const updatedBookmarks = await GetRequestWithToken(navigate, "/api/bookmarks/", queryParams);
            setBookmarks(updatedBookmarks)
            setMessage("Importavo!");
        } catch (e) {
            console.error(e);
        }
    }
    
    if (loading) {
        return <p>Loading bookmarks...</p>;
    }

    if (bookmarks.length === 0) {
        return <p>Dar nėra priskirtų žymų šiai darbo aplinkai, sukurkite naują</p>;
    }

    return (
        <div>
            <h3>Žymos:</h3>
            <button onClick={handleExport}>Eksportuojame žymas</button>
            <label htmlFor="import-bookmarks" style={{ marginLeft: "10px" }}>Importuojame žymas: </label>
                <input
                    type="file"
                    id="import-bookmarks"
                    accept=".json"
                    onChange={handleImportBookmarks}
                />
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Pavadinimas</th>
                        <th>URL</th>
                        <th>Statusas</th>
                        <th>Žymos</th>
                        <th>Veiksmai</th>
                    </tr>
                </thead>
                <tbody>
                    {bookmarks.map((bookmark) => (
                        <tr key={bookmark.id}>
                            {editingBookmark === bookmark.id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Pavadinimas.."
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="url"
                                            name="url"
                                            value={formData.url}
                                            onChange={handleChange}
                                            placeholder="URL.."
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="active">Aktyvi</option>
                                            <option value="redirect">Nukreipianti</option>
                                            <option value="dead">Mirus</option>
                                        </select>
                                    </td>
                                    <td>
                                        <ul>
                                            {tags.map((tag) => (
                                                <li key={tag.id}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.tags.includes(tag.id)}
                                                            onChange={() => handleTagChange(tag.id)}
                                                        />
                                                        {tag.name}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <button onClick={handleEditSubmit}>Išsaugoti</button>
                                        <button onClick={handleCancelEdit}>Atšaukti</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{bookmark.title}</td>
                                    <td>
                                        <a
                                            href={bookmark.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {bookmark.url}
                                        </a>
                                    </td>
                                    <td>{bookmark.status}</td>
                                    <td>
                                        {bookmark.tags.length > 0
                                            ? bookmark.tags.map((tag) => tag.name).join(", ")
                                            : "Nėra"}
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(bookmark)}>Redaguoti</button>
                                        <button onClick={() => handleDelete(bookmark.id)}>
                                            Ištrinti
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Bookmarks;
