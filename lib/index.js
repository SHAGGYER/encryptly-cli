const axios = require("axios");

exports.generateApp = async ({ serverUrl, name, url, redirectUrl }) => {
    let returnObj = {
        app: null,
        errors: null,
    };

    const fields = "displayName,firstName,lastName,email";

    try {
        const response = await axios.post(serverUrl + "/api/apps/generateApp", {
            name,
            url,
            redirectUrl,
            fields,
        });
        returnObj.app = response.data.app;
    } catch (error) {
        returnObj.errors = error.response.data.errors;
    }

    return returnObj;
};