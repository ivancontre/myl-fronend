const baseUrl = process.env.REACT_APP_HOST_BACKEND;

const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']

export const runFetch = (endpoint: string, data: object, method: string, token?: string): Promise<Response> => {

    if (!allowedMethods.includes(method.toUpperCase())) {
        throw new Error(`Los métodos permitidos son ${allowedMethods.join(', ')}`);
    }

    const url: RequestInfo = `${baseUrl}/${endpoint}`;

    let options: any = {
        method,
        headers: {
            "Content-type": "application/json"
        }
    };

    if (token) options.headers["x-token"] = token;

    if (method.toUpperCase() !== 'GET') options.body = JSON.stringify(data);

    return fetch(url, options);
};