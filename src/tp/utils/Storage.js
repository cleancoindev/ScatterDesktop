export default class Storage {
    constructor() {

    }

    static GET_STORAGE(key, type = 'localStorage') {
        return window[type].getItem(key) === null
            ? undefined
            : JSON.parse(window[type].getItem(key))
    }

    static SET_STORAGE(options, type = 'localStorage') {
        return window[type].setItem(options.key, JSON.stringify(options.value))
    }

    static REMOVE_STORAGE(key, type = 'localStorage') {
        return window[type].removeItem(key)
    }

}
