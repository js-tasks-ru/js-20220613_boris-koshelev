/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const pathKeys = path.split('.');
    return (obj) => {
        let currentValue = obj;
        for (let i = 0; i < pathKeys.length; i++) {
            if (currentValue) {
                currentValue = currentValue[pathKeys[i]];
            } else {
                return;
            }
        }
        return currentValue;
    };
}
