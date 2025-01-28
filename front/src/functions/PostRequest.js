const API_PATH = "http://127.0.0.1:8000";

const PostRequest = async (navigate, childUrl, bodyData = {}, method = "POST", authToken) => {
    const headers = {
        accept: "application/json",
        "content-type": "application/json",
    }

    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }
    console.log(method)
    const url = `${API_PATH}${childUrl}`;
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: method !== "DELETE" ? JSON.stringify(bodyData) : null,
        })

        if (response.status === 401) {
            console.log(`Unauthorized request at ${childUrl}`)
            navigate("/")
            return;
        }

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }
            return {};
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { PostRequest };
