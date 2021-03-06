var eventList = [];
var startDateAvailable;
var endDateAvailable;
var tmpSlot;
var slotAvailable = [];

var Event = function (opening, recurring, startDate, endDate) {
    this.opening = opening;
    this.recurring = recurring;
    this.startDate = startDate;
    this.endDate = endDate;

    eventList.push(this);

};

Event.prototype.availabilities = function (fromDate, toDate) {
    //first add all the possible solution    
    eventList.forEach(function (provider) {
        if (provider.opening === true) {
            startDateAvailable = Date.parse(provider.startDate);
            endDateAvailable = Date.parse(provider.endDate);
            verifDate(provider, fromDate, toDate, startDateAvailable, endDateAvailable);
        };
    });
    //then delete the already taken solution
    eventList.forEach(function (provider) {
        if (provider.opening === false) {
            startDateAvailable = Date.parse(provider.startDate);
            endDateAvailable = Date.parse(provider.endDate);
            verifDate(provider, fromDate, toDate, startDateAvailable, endDateAvailable);
        };
    });
    return printSlot(slotAvailable); //Something awesome;
};

function verifDate(provider, fromDate, toDate, startDateAvailable, endDateAvailable) {

    if (provider.opening === true && startDateAvailable <= toDate && endDateAvailable >= fromDate) {
        addSlot(fromDate, toDate, startDateAvailable, endDateAvailable);
    }
    if (provider.opening === false && startDateAvailable <= toDate && endDateAvailable >= fromDate) {
        deleteSlot(fromDate, toDate, startDateAvailable, endDateAvailable);
    }

    //    recursion
    if (startDateAvailable < toDate && provider.recurring === true) {
        verifDate(provider, fromDate, toDate, startDateAvailable + (7 * 24 * 60 * 60 * 1000), endDateAvailable + (7 * 24 * 60 * 60 * 1000));
    }
}

//add a solution to the array
function addSlot(fromDate, toDate, startDateAvailable, endDateAvailable) {
    tmpSlot = startDateAvailable;
    while (tmpSlot < Date.parse(toDate) && tmpSlot < endDateAvailable) {
        slotAvailable.push(timeConverter(tmpSlot));
        tmpSlot += 30 * 60 * 1000;
    };

}


//delete a solution from the array
function deleteSlot(fromDate, toDate, startDateAvailable, endDateAvailable) {
    tmpSlot = startDateAvailable;
    while (tmpSlot < Date.parse(toDate) && tmpSlot <= endDateAvailable) {
        for (i = 0; i < slotAvailable.length; i++) {
            if (timeConverter(tmpSlot) == slotAvailable[i]) {
                slotAvailable.splice(i, 1);
            }
        }
        tmpSlot += 30 * 60 * 1000;
    };
}

//convert from timestamp to readeable time
function timeConverter(timestamp) {
    var a = new Date(timestamp);
    var months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
    return time;
}

//print the answer on the console
function printSlot(slotAvailable) {
    if (slotAvailable[0] == null) {
        console.log('I\'m not available at all.');
    } else {
        slotAvailable.forEach(function (date) {
            console.log('I\'m available the ' + date);
        });
        console.log('I\'m not available any other time !');
    }
}
