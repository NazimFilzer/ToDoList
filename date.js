//jshint esversion:6 ?


function getDate() {

    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return today.toLocaleDateString("en-US", options);
}
function getDay() {

    let today = new Date();

    let options = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-US", options);
}

module.exports.getDate = getDate;
module.exports.getDay = getDay;

// console.log(module.exports);
// output: { getDate: [Function: getDate], getDay: [Function: getDay] }
// more refactoring in lecture 272 angela

