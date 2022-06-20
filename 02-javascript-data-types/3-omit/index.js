/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */

const pipe = (args, [firstFunc, ...otherFuncs]) => {
    let result = firstFunc(...args);
    otherFuncs.forEach((func) => {
        result = func(result);
    });
    return result;
};

export const omit = (obj, ...fields) => {
    return pipe(
        [obj],
        [
            Object.entries,
            (allFields) => allFields.filter(([key]) => fields.includes(key) === false),
            Object.fromEntries,
        ]
    );
};
