/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

    const customComparsionAsc = (a, b) => a.localeCompare(b, ['ru', 'en'], {
        caseFirst: 'upper'
    });

    const customComparsionDesc = (a, b) => b.localeCompare(a, ['ru', 'en'], {
        caseFirst: 'upper'
    });

    const newArray = [...arr];

    if (param === 'asc') {
        return newArray.sort(customComparsionAsc);
    } else {
        return newArray.sort(customComparsionDesc);
    }
}
