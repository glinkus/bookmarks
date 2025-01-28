import { GetRequest } from "./GetRequest";
import verifyToken from "./VerifyToken";

const GetRequestWithToken = async (navigate, childUrl, queryParams = []) => {
    const isValid = await verifyToken(navigate);
    if (!isValid) {
        throw new Error("Token verification failed");
    }
    const authToken = localStorage.getItem("access")

    return await GetRequest(navigate, childUrl, queryParams, authToken);
}
export { GetRequestWithToken};