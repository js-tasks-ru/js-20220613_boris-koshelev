/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

    const customComparsion = (char1, char2) => {
        if (param === "desc") {
            [char1, char2] = [char2, char1];
        }

        return char1.localeCompare(char2, ['ru', 'en'], {
            caseFirst: 'upper'
        });
    };

    return [...arr].sort(customComparsion);
}
