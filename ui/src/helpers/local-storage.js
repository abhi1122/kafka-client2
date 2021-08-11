const set = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

const get = (key) => {
    if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
    } else {
        return false;
    }
}

const remove = (key) => {
    localStorage.removeItem(key);
}

const removeAll = () => {
    localStorage.clear();
}

export {
    set,
    get,
    remove,
    removeAll
};