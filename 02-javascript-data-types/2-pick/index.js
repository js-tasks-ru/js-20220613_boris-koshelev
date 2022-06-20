/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */

const pipe = (args, [firstFunc, ...otherFuncs]) => {
    let result = firstFunc(...args);
    otherFuncs.forEach((func) => {
        result = func(result);
    });
    return result;
};

export const pick = (obj, ...fields) => {
    return pipe(
        [obj],
        [
            Object.entries,
            (allFields) => allFields.filter(([key]) => fields.includes(key)),
            Object.fromEntries,
        ]
    );
};
