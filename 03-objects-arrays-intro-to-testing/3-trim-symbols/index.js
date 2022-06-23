/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === 0) { return ''; }
    if (!size) { return string; }
    if (string.length === 0) { return string; }

    let result = '';
    let currentChar = string[0];
    let counter = 0;

    for (const char of string) {
        if (char === currentChar) {
            counter++;
            if (counter <= size) {
                result += char;
            }
        } else {
            counter = 1;
            result += char;
            currentChar = char;
        }
    }
    return result;
}

console.log(trimSymbols('xxxaaxx', 1));
