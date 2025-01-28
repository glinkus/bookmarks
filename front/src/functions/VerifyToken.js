const verifyToken = async (navigate) => {
    const token = localStorage.getItem("refresh");
    if (!token) {
        console.log("Prisijunk, Tu, nekadėjau");
        navigate("/");
        return false;
    }
    try {
        const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: token }),
        })

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access", data.access);
            console.log("Token is valid");
            console.log(data.access)
            return true;
        } else {
            alert("Prisijunk iš naujo");
            localStorage.removeItem("refresh");
            navigate("/");
            return false;
        }
    } catch (e) {
        console.error(e)
        alert("Ups :(")
        navigate("/")
        return false;
    }
}

export default verifyToken;
