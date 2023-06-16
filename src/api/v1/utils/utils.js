const utils = {
    waitFor: function(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

export default utils;



