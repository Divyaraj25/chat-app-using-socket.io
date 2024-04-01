exports.generateMsgs = (text, name) => {
    return {
        name,
        text,
        createdAt: new Date().getTime()
    }
};

exports.generateLocations = (url, name) => {
    return {
        name,
        url,
        createdAt: new Date().getTime()
    }
}