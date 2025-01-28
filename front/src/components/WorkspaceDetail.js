import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetRequestWithToken } from "../functions/GetRequestWithToken";
import Bookmarks from "../components/Bookmarks";
import CreateBookmark from "./CreateBookmarks";

const WorkspaceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const data = await GetRequestWithToken(navigate, `/api/workspaces/${id}/`);
                setWorkspace(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspace();
    }, [id, navigate])

    const addBookmarkToList = (newBookmark) => {
        setBookmarks((prev) => [...prev, newBookmark]);
    }

    if (loading) {
        return <p>Laukiama..</p>;
    }

    return (
        <div>
            <h2>Darbo aplinka "{workspace.name}"</h2>
            <Bookmarks workspaceId={id} bookmarks={bookmarks} setBookmarks={setBookmarks}></Bookmarks>
            <CreateBookmark workspaceId={id} onBookmarkCreated={addBookmarkToList}></CreateBookmark>
            <button onClick={() => navigate(-1)}>Grįžti</button>
        </div>
    )
}

export default WorkspaceDetail;