import * as requestData from "request-data";

export default () => {
    return (request, response, next) => {
        if (request.headers["content-type"] === "application/json") {
            const handler = requestData(1e7, (dataRequest, dataResponse, data) => {
                dataRequest.body = data;
                dataRequest._body = true;
                next();
            });

            handler(request, response);
            return;
        }
        // Causes openapi to not try to parse the incomming stream.
        request._body = true;
        next();
    };
};
