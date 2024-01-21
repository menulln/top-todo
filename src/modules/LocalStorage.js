export default class LocalStorage {
    static getItem(key) {
        return localStorage.getItem(key);
    }
    
    static setItem(key, value) {
        return localStorage.setItem(key, value);
    }

    static clear() {
        return localStorage.clear();
    }
}