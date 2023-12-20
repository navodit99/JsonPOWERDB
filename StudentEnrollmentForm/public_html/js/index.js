/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

$(document).ready(function () {
    $('#rollno').prop('disabled', false);

    // Event listener for the Employee ID input
    $('#rollno').on('input', function () {
        var rollno = $(this).val().trim();

        // Enable the Employee Name field when ID is entered
        if (rollno !== '') {
            $('#name').prop('disabled', false);
            $('#save').prop('disabled', false);
            $('#change').prop('disabled', false);
            $('#reset').prop('disabled', false);
        } else {
            // If ID is empty, disable subsequent fields and buttons
            $('#name').prop('disabled', true);
            $('#class').prop('disabled', true);
            $('#DOB').prop('disabled', true);
            $('#address').prop('disabled', true);
            $('#enrollno').prop('disabled', true);
            $('#save').prop('disabled', true);
            $('#change').prop('disabled', true);
            $('#reset').prop('disabled', true);
        }
    });

    // Event listener for the Employee Name input
    $('#name').on('input', function () {
        var name = $(this).val().trim();

        // Enable the Basic Salary field when Name is entered
        if (name !== '') {
            $('#class').prop('disabled', false);
        } else {
            $('#class').prop('disabled', true);
        }
    });
    $('#class').on('input', function () {
        var classs = $(this).val().trim();

        // Enable the Basic Salary field when Name is entered
        if (classs !== '') {
            $('#DOB').prop('disabled', false);
        } else {
            $('#DOB').prop('disabled', true);
        }
    });
    $('#DOB').on('input', function () {
        var DOB = $(this).val().trim();

        // Enable the Basic Salary field when Name is entered
        if (DOB !== '') {
            $('#address').prop('disabled', false);
        } else {
            $('#address').prop('disabled', true);
        }
    });
    $('#address').on('input', function () {
        var address = $(this).val().trim();

        // Enable the Basic Salary field when Name is entered
        if (address !== '') {
            $('#enrollno').prop('disabled', false);
        } else {
            $('#enrollno').prop('disabled', true);
        }
    });
    // Example condition: Trigger changedata() when a record is found and the name matches a certain value
    $('#change').on('click', function () {
        changeData();
    });


    // Event listener for the Save button
    $('#save').on('click', function () {
        saveData();
    });

    // Event listener for the Reset button
    $('#reset').on('click', function () {
        resetForm();
    });

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var studentDBName = "SchoolDB";
var studentRelationName = "Student-Rel";
var connToken = '90931937|-31949300468931623|90960411';
$('#rollno').focus();

function saveRecNo2LS(jsonObj) {
    var lvdata = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvdata.rec_no);
}
function getRollnoAsJsonObj() {
    var rollno = $('#rollno').val();
    var jsonStr = {
        no: rollno
    };
    return JSON.stringify(jsonStr);
}
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#name').val(record.name);
    $('#stdclass').val(record.stdclass);
    $('#birthdate').val(record.birthdate);
    $('#address').val(record.address);
    $('#enrollno').val(record.enrollno);
}
function resetForm() {
    $('#rollno').val("");
    $('#name').val("");
    $('#stdclass').val("");
    $('#birthdate').val("");
    $('#address').val("");
    $('#enrollno').val("");
    $('#rollno').prop('disabled', false);
    $('#save').prop('disabled', true);
    $('#change').prop('disabled', true);
    $('#reset').prop('disabled', true);
    $('#rollno').focus();
}

function validateData() {
    var rollno, name, stdclass, birthdate, address, enrollno;
    rollno = $('#rollno').val();
    name = $('#name').val();
    stdclass = $('#stdclass').val();
    birthdate = $('#birthdate').val();
    address = $('#address').val();
    enrollno = $('#enrollno').val();

    if (rollno === '') {
        alert("Student rollno missing");
        $('#rollno').focus();
        return '';
    }
    if (name === '') {
        alert("Student name missing");
        $('#name').focus();
        return '';
    }
    if (stdclass === '') {
        alert("Student class missing");
        $('#class').focus();
        return '';
    }
    if (birthdate === '') {
        alert("Student birthdate missing");
        $('#DOB').focus();
        return '';
    }
    if (address === '') {
        alert("Student address missing");
        $('#address').focus();
        return '';
    }
    if (enrollno === '') {
        alert("Student enrollno missing");
        $('#enrollno').focus();
        return '';
    }

    var jsonStrObj = {
        rollno: rollno,
        name: name,
        class: stdclass,
        DOB: birthdate,
        address: address,
        enrollno: enrollno
    };
    return JSON.stringify(jsonStrObj);
}

function getStd() {
    var rollnoJsonObj = getRollnoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, rollnoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#name").focus();
    } else if (resJsonObj.status === 200) {
        $('#rollno').prop('disabled', true);
        fillData(resJsonObj);

        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#name').focus();
    }
}


function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return '';
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#rollno').focus();
}
function changeData() {
    $('#change').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#rollno').focus();
}
});