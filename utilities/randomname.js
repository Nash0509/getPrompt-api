const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function randomName() {
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    console.log(randomName);
    return randomName;
}


module.exports = {randomName};