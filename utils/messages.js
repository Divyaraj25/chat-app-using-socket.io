exports.generateMsgs = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
};

exports.generateLocations = (url) => {
    return {
        url,
        createdAt: new Date().getTime()
    }
}