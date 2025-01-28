import React, { useState, useEffect } from "react";
import { GetRequestWithToken } from "../functions/GetRequestWithToken";
import { useNavigate } from "react-router-dom";
import { PostRequestWithToken } from "../functions/PostRequestWithToken";

const Workspaces = () => {
    const navigate = useNavigate();
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workspaceName, setWorkspaceName] = useState("");

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const data = await GetRequestWithToken(navigate, "/api/workspaces/");
                setWorkspaces(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspaces();
    }, [navigate, setWorkspaces])

    const handleCreateWorkspace = async (e) => {
        e.preventDefault();
        try{
            const newWorkspace = await PostRequestWithToken(navigate, "/api/workspaces/", { name: workspaceName,})
            setWorkspaces((prevWorkspaces) => [...prevWorkspaces, newWorkspace]);
            setWorkspaceName("");
        }catch(error) {
            console.error(error);
        }
    }

    if (loading) {
        return <p>Kraunama...</p>;
    }

    return (
        <div>
            <ul className="work">
                {workspaces.map((workspace) => (
                    <li key={workspace.id} onClick={() => navigate(`/workspaces/${workspace.id}`)}>
                        {workspace.name}
                    </li>
                ))}
            </ul>
            <h3>Sukurti naują darbo aplinką</h3>
            <form className="workspace" onSubmit={handleCreateWorkspace}>
                <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Įveskite darbo aplinkos pavadinimą"
                    required
                />
                <button type="submit">Sukurti</button>
            </form>
        </div>
    )
}

export default Workspaces;
