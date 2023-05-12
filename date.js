module.exports.getDay = getDay;

function getDay() {
return new Date().toLocaleString("default", {weekday : "long"});  
};


module.exports.getFullDate = getFullDate;

function getFullDate() {
    return new Date(); 
    };