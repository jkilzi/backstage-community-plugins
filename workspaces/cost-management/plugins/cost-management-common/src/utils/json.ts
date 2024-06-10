function snakeToCamel(snake: string) {
    return snake.split('_').map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
}


export function camelCaseReviver(this: any, key: string, value: string) {
    if (key === '') return value; // For the root object, return the value as is
    const pascalKey = snakeToCamel(key);
    this[pascalKey] = value; // Assign the transformed key to the value in the current context
    return value; // Return the value to maintain the default behavior
}




