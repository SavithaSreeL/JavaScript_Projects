// todo.js

let valuearray = JSON.parse(localStorage.getItem("savedArr")) || [];
let pendingFlag = false;
let completedFlag = false;
document.getElementById("add").disabled = true;
let rowId = 0;


function generateRowId() {
    return ++rowId;
}
function enableAdd() {
    category = document.getElementById("drop1").value;;
    description = document.getElementById("desc1").value;
    if (category && description) {
        document.getElementById("add").disabled = false;
    }
}
function addTask() {
    debugger;
    generateRowId();
    let tempArr = { rowid: rowId, category: category, desc: description, status: false }
    valuearray.push(tempArr);
    console.log('values', valuearray)
    localStorage.setItem("savedArr", JSON.stringify(valuearray));
    displayValues(valuearray);
    resetValues();
}
function resetValues() {
    document.getElementById("drop1").value = '';
    document.getElementById("desc1").value = null;
    document.getElementById("add").disabled = true;
    document.getElementById("rad1").checked = true;

}
function CheckFunction(row) {
    debugger;
    for (i = 0; i < valuearray.length; i++) {
        if (valuearray[i].rowid === row) {
            valuearray[i].status = !valuearray[i].status;
            break;
        }
        localStorage.setItem("savedArr", JSON.stringify(valuearray))
    }
}
function displayValues(array) {
    if (!array || array.length === 0) {
        document.getElementById("tbody1").innerHTML = '<tr><td colspan="5" class="text-center text-warning p-4">No records found</td></tr>';
        return;
    }
    debugger;
    console.log('entered')
    console.log('initial', array)
    var rows = '';
    for (var i = 0; i < array.length; i++) {
        rows += '<tr id="row' + i + '">';
        rows += '<td>' + (i + 1) + '</td>';
        rows += '<td>' + array[i].category + '</td>';
        rows += '<td>' + array[i].desc + '</td>';
        rows += '<td ><div class="form-check form-check-success "><input type="checkbox" style="border: #8d8d8d solid 1px" class="form-check-input" ' + (array[i].status ? 'checked' : '') + '  id="check' + i + '" onchange="CheckFunction(' + array[i].rowid + ')"></div></td>';
        rows += '<td><button class="btn text-danger" onclick="DeleteRow(' + array[i].rowid + ')">Delete</button></td>';
        rows += '</tr>';
    }
    document.getElementById('tbody1').innerHTML = rows;
}
function DeleteRow(row) {
    debugger;
    console.log('val in d ', valuearray)
    valuearray.forEach((element, index) => {
        if (element.rowid === row) {
            valuearray.splice(index, 1);
        }
    });
    localStorage.setItem("savedArr", JSON.stringify(valuearray));
    if (completedFlag) {
        CompletedClicked();
    }
    else if (pendingFlag) {
        PendingClicked()
    }
    else {
        displayValues(valuearray);
    }

}

function CompletedClicked() {
    completedFlag = true;
    pendingFlag = false;
    let CompletedItems = valuearray.filter(item => item.status === true);
    displayValues(CompletedItems);

}
function AllClicked() {
    completedFlag = false;
    pendingFlag = false;
    displayValues(valuearray);
}
function PendingClicked() {
    pendingFlag = true;
    completedFlag = false;
    let PendingItems = valuearray.filter(item => item.status === false);
    displayValues(PendingItems);
}
function clearCompleted() {
    debugger;
    for (let i = valuearray.length - 1; i >= 0; i--) {
        if (valuearray[i].status === true) {
            valuearray.splice(i, 1);
        }
    }
    localStorage.setItem("savedArr", JSON.stringify(valuearray));
    if (completedFlag) {
        CompletedClicked();
    }
    else if (pendingFlag) {
        PendingClicked()
    }
    else {
        displayValues(valuearray);
    }

}
displayValues(valuearray);


