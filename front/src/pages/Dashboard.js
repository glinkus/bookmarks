import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetRequestWithToken } from "../functions/GetRequestWithToken";
import verifyToken from "../functions/VerifyToken";
import Workspaces from "../components/Workspaces";

function Dashboard() {
    const navigate = useNavigate();
    const [logout, setLogout] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const verify = async () => {
            const isValid = await verifyToken(navigate);
            if (!isValid) {
                return;
            }
            setIsLoading(false);
        };
        verify();
    }, [navigate, logout])

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const queryParams = [{ name: "query", value: searchQuery }];
            const data = await GetRequestWithToken(navigate, "/api/search/bookmarks/", queryParams);
            setSearchResults(data);
        } catch (error) {
            console.error(error);
        }
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h2>Sveiki atvykę į žymių valdymo sistemą!</h2>
            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Ieškoti žymių.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Ieškoti</button>
                </div>
                {searchResults.length > 0 && (
                    <div>
                        <h3>Paieškos rezultatai</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Pavadinimas</th>
                                    <th>URL</th>
                                    <th>Statusas</th>
                                    <th>Žymos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((bookmark) => (
                                    <tr key={bookmark.id}>
                                        <td>{bookmark.title}</td>
                                        <td>
                                            <a href={bookmark.url} target="_blank" rel="noopener noreferrer"> {bookmark.url}</a>
                                        </td>
                                        <td>{bookmark.status}</td>
                                        <td>
                                            {bookmark.tags.length > 0 ? bookmark.tags.map((tag) => tag.name).join(", "): "No tags"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div><Workspaces /></div>
            <div>
                <button
                    type="logout"
                    onClick={() => {
                        localStorage.removeItem("refresh");
                        setLogout(true);
                    }}
                >
                    Atsijungti
                </button>
            <p></p>
            </div>
            <button type="Tag" onClick={() => navigate("/tags")}>Žymos</button>
        </>
    )
}

export default Dashboard;
