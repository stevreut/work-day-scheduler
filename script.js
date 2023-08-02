// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Dynamically render hour elements (my add)
  renderRows();
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  // Answer: Done in renderRows() (see nowHr)
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
  displayTodayInHeader();
});

function renderRows() {
// <div id="hour-9" class="row time-block past/present/future">
//   <div class="col-2 col-md-1 hour text-center py-3">9AM</div>
//   <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
//   <button class="btn saveBtn col-2 col-md-1" aria-label="save">
//     <i class="fas fa-save" aria-hidden="true"></i>
//   </button>
// </div>
  const FIRST_HOUR = 8;
  const LAST_HOUR = 18;
  let nowHr = dayjs().hour();
  // TODO - begin test code
  console.log("Don't forget to remove test code!!");
  nowHr = 13;
  // TODO - end test code
  console.log('now hour = ' + nowHr);
  for (let hr=FIRST_HOUR;hr<=LAST_HOUR;hr++) {
    console.log('formatting hr = ' + hr);
    let outerDiv = document.createElement("div");
    outerDiv.setAttribute("id","hour-"+hr);
    let classValue = "row time-block ";
    // Determine past/present/future class of row based on comparison with
    // current time (nowHr).
    if (hr < nowHr) {
      classValue += "past";
    } else if (hr === nowHr) {
      classValue += "present";
    } else {
      classValue += "future";
    }
    outerDiv.setAttribute("class",classValue);
    let innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","col-2 col-md-1 hour text-center py-3");
    let hourLabel;
    // Calculate display value of hour based on usual convention:
    //   12AM = midnight (beginning of day = hour 0)
    //   12PM = noon (hour = 12)
    //   hours less than 12 or displayed as-is with AM
    //   hours greater than 12 are diminished by 12 and displayed with PM
    //     (e.g. 13 -> "1PM")
    if (hr === 0) {
      hourLabel = "12AM";
    } else if (hr < 12) {
      hourLabel = hr + "AM";
    } else if (hr === 12) {
      hourLabel = "12PM";
    } else {
      hourLabel = (hr-12)+"PM";
    }
    console.log('hour label = "' + hourLabel + '"');
    innerDiv.textContent = hourLabel;
    outerDiv.appendChild(innerDiv);
    let textArea = document.createElement("textarea");
    textArea.setAttribute("class","col-8 col-md-10 description");
    textArea.setAttribute("rows","3");
    outerDiv.appendChild(textArea);
    let saveButton = document.createElement("button");
    saveButton.setAttribute("class","btn saveBtn col-2 col-md-1");
    saveButton.setAttribute("area-label","save");
    let iElem = document.createElement("i");
    iElem.setAttribute("class","fas fa-save");
    iElem.setAttribute("aria-hidden","true");
    saveButton.appendChild(iElem);
    outerDiv.appendChild(saveButton);
    document.querySelector("#hour-list").appendChild(outerDiv);
    console.log('append done for hour hr = ' + hr);
  }
}

function displayTodayInHeader() {
  console.log('alter date');
  let currDayPara = document.querySelector("#currentDay");
  console.log('para = ' + currDayPara);
  if (currDayPara !== null) {
    let dayPhrase = dayjs().format("MMM D, YYYY");
    console.log("day phrase = " + dayPhrase);
    currDayPara.textContent = dayPhrase;
  } else {
    currDayPara.textContent = "";
  }
}