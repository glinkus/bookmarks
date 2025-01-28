import { PostRequest } from "./PostRequest";
import verifyToken from "./VerifyToken";

const PostRequestWithToken = async (navigate, childUrl, bodyData = {},  method = "POST") => {
    const isValid = await verifyToken(navigate);
    if (!isValid) {
        throw new Error("Token verification failed");
    }
    const authToken = localStorage.getItem("access");

    return await PostRequest(navigate, childUrl, bodyData, method, authToken);
}

export { PostRequestWithToken };
