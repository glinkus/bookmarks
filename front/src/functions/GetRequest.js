const API_PATH = "http://127.0.0.1:8000"; 
const GetRequest = async (navigate, childUrl, queryParams = [], authToken) => {
    const headers = {
        accept: "application/json",
        "content-type": "application/json",
    }
    if(authToken){
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const queryString = queryParams.map(({name, value}) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`).join("&");

    const url = `${API_PATH}${childUrl}${queryString ? `?${queryString}` : ""}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers,
        })
        if (response.status === 401) {
            console.log("401");
            navigate("/");
            return;
        }
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch(e){
        console.error(e);
        throw e;
    }
}

export {GetRequest};