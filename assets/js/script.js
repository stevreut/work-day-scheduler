let calendarInfo = [];  // initial default is empty array prior to loading

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
  addHourListListeners();
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
  loadSavedCalendarInfo();
  //
  // TODO: Add code to display the current date in the header of the page.
  displayTodayInHeader();
});

function renderRows() {
// <div id="hour-9" class="row time-block past/present/future">
//   <div class="col-2 col-md-1 hour text-center py-3">9AM</div>
//   <textarea class="col-8 col-md-10 description" rows="3" data-idx="9"> </textarea>
//   <button class="btn saveBtn col-2 col-md-1" aria-label="save" data-idx="9">
//     <i class="fas fa-save" aria-hidden="true" data-idx="9"></i>
//   </button>
// </div>
  const FIRST_HOUR = 6;  // TODO
  const LAST_HOUR = 23;  // TODO
  let nowHr = dayjs().hour();
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
    textArea.setAttribute("data-idx",hr);
    outerDiv.appendChild(textArea);
    let saveButton = document.createElement("button");
    saveButton.setAttribute("class","btn saveBtn col-2 col-md-1");
    saveButton.setAttribute("area-label","save");
    saveButton.setAttribute("data-idx",hr);
    let iElem = document.createElement("i");
    iElem.setAttribute("class","fas fa-save");
    iElem.setAttribute("aria-hidden","true");
    iElem.setAttribute("data-idx",hr);
    saveButton.appendChild(iElem);
    outerDiv.appendChild(saveButton);
    document.querySelector("#hour-list").appendChild(outerDiv);
    console.log('append done for hour hr = ' + hr);
  }
}

function displayTodayInHeader() {
  console.log('alter date');
  let currDayPara = document.querySelector("#currentDay");
  console.log('para = ' + currDayPara.textContent);
  if (currDayPara !== null) {
    let dayPhrase = dayjs().format("dddd MMM[.] D, YYYY");
    console.log("day phrase = " + dayPhrase);
    currDayPara.textContent = dayPhrase;
  } else {
    currDayPara.textContent = "";
  }
}

function loadSavedCalendarInfo() {
  console.log('started load');
  calendarInfo = JSON.parse(localStorage.getItem("calendar-info"));
  if (calendarInfo === null) {
    console.log('info set to empty array');
    calendarInfo = [];
  }
  for (let i=0;i<calendarInfo.length;i++) {
    let entry = calendarInfo[i];
    console.log('loaded entry for ' + i + ' = ' + entry);
    let numKey = entry.key;
    console.log('loaded num key = ' + numKey);
    let hourKey = "hour-" + numKey;
    console.log('string hour key = "' + hourKey + '"');
    let content = entry.content;
    console.log('content for ' + i + ' = ' + content + '"');
    let outerDivLocal = document.querySelector("#"+hourKey);
    if (outerDivLocal === null) {
      console.log('no div found for key "' + hourKey + '"');
    } else {
      console.log('div found for "' + hourKey + '"');
      console.log('div contents = ' + outerDivLocal);
      let txtArea = document.querySelector("#"+hourKey+ " textarea");
      if (txtArea === null) {
        console.log('no textarea found for "' + hourKey + '"');
      } else {
        console.log('set textarea for "' + hourKey + '" with "' + content + '"');
        txtArea.value = content;
      }
    }
  }
}

function addHourListListeners() {
  console.log('adding listener');
  let hourList = document.querySelector("#hour-list");
  if (hourList === null) {
    console.log("no hour-list identifier found when attempting to add listener");
  } else {
    hourList.addEventListener("click",function(event) {
      console.log('listener triggered');
      let elem = event.target;
      if (elem.matches(".saveBtn") || elem.matches(".saveBtn>i")) {
        console.log("click event IS a match");
        console.log("matched elem = '" + elem + "'");
        let hourKey = "hour-" + elem.getAttribute("data-idx");
        console.log('key for changed item = ' + hourKey);
        saveForHourKey(hourKey);
      }
    })
    hourList.addEventListener("change" /*TODO*/,function(event) {
      console.log("change listener triggered");
      let elem = event.target;
      if (elem.matches("textarea")) {
        console.log("textarea change detected");
        let idx = elem.getAttribute("data-idx");
        console.log("change was to textarea for hour-" + idx);
        elem.classList.add("unsaved");
        console.log('changed hour-' + idx + ' to unsaved');
      }
    })
  }
}

function saveForHourKey(hKey) {
  let div = document.querySelector("#"+hKey);
  if (div === null) {
    console.log("no div found for key '" + hKey + "'");
  } else {
    let txtArea = document.querySelector("#"+hKey + " textarea");
    content = txtArea.value;
    console.log("textarea content to save  = '" + content + "'");
    let numKey = parseInt(hKey.substring(5));  // Ignore "hour-" and convert to numeric
    if (numKey === null) {
      console.log("unable to parse from " + hKey);
    } else {
      console.log("numeric key to save = " + numKey);
      let matchingEntryFound = false;
      let matchedIdx = -1;
      for (i=0;i<calendarInfo.length&&(!matchingEntryFound);i++) {
        matchingEntryFound = (calendarInfo[i].key === numKey);
        if (matchingEntryFound) {
          matchedIdx = i;
        }
      }
      if (matchingEntryFound) {
        if (content !== calendarInfo[matchedIdx].content) {
          console.log('altering idx ' + matchedIdx + ' in place');
          calendarInfo[matchedIdx].content = content;
          localStorage.setItem("calendar-info",JSON.stringify(calendarInfo));
        }  // else no change and no need to save
      } else {
        if (content !== "") {
          console.log('appending new entry for ' + numKey + ' ' + content);
          calendarInfo.push({key:numKey,content:content});
          localStorage.setItem("calendar-info",JSON.stringify(calendarInfo));
        } // else no point in appending empty content - effectively a non-change
      }
      // Regardless of whether a localStorage change was needed, the "unsaved" class should be cleared
      // to signal use that nothing further is needed.
      txtArea.classList.remove("unsaved");  // TODO - must test what happens when "unsaved" class has not been applied
    }
  }
}