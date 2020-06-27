(function ()// Self invoking anonymous function to be used as a global scope
{
    let tasksList; //Model

    if (localStorageIsEmpty("tasksListKey")) {
        tasksList = new Array();
    }

    else {

        tasksList = updateModelFromLocalStorage("tasksListKey");

        tasksList.forEach(element => {
            updateUI(element);
        });
    }

    document.getElementById("save").addEventListener("click", onAddNoteButtonClicked);

    function localStorageIsEmpty(key) {
        let value = localStorage.getItem(key);

        if (value == null) {
            return true;
        }

        return false;
    }

    function updateModelFromLocalStorage(key) {

        return JSON.parse(localStorage.getItem(key));
    }

    function onAddNoteButtonClicked() {

        var dateInput = document.getElementById("date").value;
        var timeInput = document.getElementById("time").value;
        var taskBodyInput = document.getElementById("task-body").value;

        taskBodyInput = taskBodyInput.trim(); // removes whitespaces from start end end of string

        if (!taskBodyValidation(taskBodyInput)) {
            alert("Please enter a non-empty task body"); // or warn in some other way
            return;
        }

        if (!timeValidation(dateInput, timeInput)) {

            return;
        }

        var id = getValidIdForCurrentNote();

        var jsonNote = createJsonObjectForCurrentNode(dateInput, timeInput, taskBodyInput, id);

        updateUI(jsonNote);
        updateModel(jsonNote);

    }

    function timeValidation(dateInput, timeInput) {

        if (!validateDateIsNotEmpty(dateInput)) {
            return false;
        }

        var currentTime = new Date();
        var taskTime = new Date(dateInput + "," + timeInput);

        if (timeInput == "") {
            if (currentTime.getFullYear() == taskTime.getFullYear()) {
                if (currentTime.getMonth() == taskTime.getMonth()) {
                    if (currentTime.getDay() == taskTime.getDay()) {
                        return true;
                    }
                }
            }
        }


        if (currentTime.getTime() > taskTime.getTime()) {
            alert("Date cannot be in the past");
            return false;
        }

        return true;
    }

    function validateDateIsNotEmpty(dateInput) {

        if (dateInput == "") {
            alert("Date cannot be empty");
            return false;
        }
        return true;
    }


    function taskBodyValidation(taskBodyInput) {
        if (taskBodyInput == "") {
            return false;
        }

        return true;
    }

    function getValidIdForCurrentNote() {
        if (tasksList.length == 0) {
            return "1";
        }
        else {
            var indexOfLastNote = tasksList.length - 1;
            var lastNoteID = tasksList[indexOfLastNote].id + 1;

            return lastNoteID.toString(); //In JSON object need a string and not a number
        }
    }

    function createJsonObjectForCurrentNode(dateInput, timeInput, taskBodyInput, id) {
        var jsonNote =

        {
            "task": taskBodyInput,
            "date": dateInput,
            "time": timeInput,
            "id": id
        }

        return jsonNote;
    }

    function updateUI(note) {

        var noteDiv = CreateNoteDive();

        createRemoveButtonInNote(noteDiv, note.id);
        createTaskAreaInNote(noteDiv, note.task);
        createDateParagraphInNote(noteDiv, note.date);
        createTimeParagrapgInNote(noteDiv, note.time);

        addRemoveButtonEventListener(noteDiv);
        displayNoteOnBoard(noteDiv);
    }

    function updateModel(note) {
        tasksList.push(note);

        localStorage.setItem("tasksListKey", JSON.stringify(tasksList));
    }

    function CreateNoteDive() {
        let noteDiv = document.createElement("div");
        let id = document.createAttribute("id");
        id.value = "note-div";

        noteDiv.setAttributeNode(id);

        return noteDiv;
    }

    function createRemoveButtonInNote(noteDiv, id) {
        var removeButton = document.createElement("button");

        let idAttribute = document.createAttribute("id");
        idAttribute.value = id;
        removeButton.setAttributeNode(idAttribute);

        let typeAttribute = document.createAttribute("type");
        typeAttribute.value = "button";
        removeButton.setAttributeNode(typeAttribute);

        let classAttribute = document.createAttribute("class");
        classAttribute.value = "btn btn-default";
        removeButton.setAttributeNode(classAttribute);

        let ariaLabelAttribute = document.createAttribute("aria-label");
        ariaLabelAttribute.value = "Right Align";
        removeButton.setAttributeNode(ariaLabelAttribute);

        settingGlypgSpanInButton(removeButton);
        noteDiv.appendChild(removeButton);
    }

    function settingGlypgSpanInButton(removeButton) {
        let span = document.createElement("span");

        let classAttribute = document.createAttribute("class");
        classAttribute.value = "glyphicon glyphicon-remove";
        span.setAttributeNode(classAttribute);

        let ariaHiddenAttribute = document.createAttribute("aria-hidden");
        ariaHiddenAttribute.value = "true";
        span.setAttributeNode(ariaHiddenAttribute);

        removeButton.appendChild(span);
    }

    function createTaskAreaInNote(noteDiv, task) {
        var textArea = document.createElement("textarea");

        let idAttribute = document.createAttribute("id");
        idAttribute.value = "textareaid";
        textArea.setAttributeNode(idAttribute);

        textArea.value = task;
        textArea.disabled = "true";
       
        noteDiv.appendChild(textArea);
    }

    function createDateParagraphInNote(noteDiv, date) {
        var dateParagraph = document.createElement("p");

        let dateparagraphClass = document.createAttribute("class");
        dateparagraphClass.value = "datetimeparagraphclass";
        dateParagraph.setAttributeNode(dateparagraphClass);

        dateParagraph.innerHTML = date;

        noteDiv.appendChild(dateParagraph);
    }

    function createTimeParagrapgInNote(noteDiv, time) {
        var timeParagraph = document.createElement("p");

        let timeparagraphClass = document.createAttribute("class");
        timeparagraphClass.value = "datetimeparagraphclass";
        timeParagraph.setAttributeNode(timeparagraphClass);

        timeParagraph.innerHTML = time;

        noteDiv.appendChild(timeParagraph);
    }

    function addRemoveButtonEventListener(noteDiv) {
        removeButton = noteDiv.querySelector("button");
        removeButton.addEventListener('click', function () {
            var id = removeNoteFromUI(noteDiv);
            removeNoteFromModel(id);

        }
        );
    }

    function displayNoteOnBoard(noteDiv) {
        document.getElementById("rows").appendChild(noteDiv);
    }

    function removeNoteFromUI(noteDiv) {
        removeButton = noteDiv.querySelector("button");
        let id = removeButton.getAttribute("id");

        document.getElementById("rows").removeChild(noteDiv);

        return id;
    }

    function removeNoteFromModel(id) {
        for (let index = 0; index < tasksList.length; index++) {
            if (tasksList[index].id == id) {
                tasksList.splice(index, 1);
            }
        }

        localStorage.setItem("tasksListKey", JSON.stringify(tasksList));


    }

})();