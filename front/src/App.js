import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import WorkspaceDetail from "./components/WorkspaceDetail";
import TagsPage from "./pages/TagsPage";
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
        <Route path="/tags" element={<TagsPage />} />
      </Routes>
    </Router>
  )
}

export default App;
