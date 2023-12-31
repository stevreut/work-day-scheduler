let calendarInfo = [];  // initial default is empty array prior to loading

renderRows();
addHourListListeners();
loadSavedCalendarInfo();
displayTodayInHeader();

function renderRows() {
  // Dynamically generates a <div/> element for each hour/row in the calendar in the 
  // following form, where the id=, inner <div> content, and various data-idx=
  // attributes vary depending on hour being represented:
  //
  // <div id="hour-9" class="row time-block past/present/future">
  //   <div class="col-2 col-md-1 hour text-center py-3">9AM</div>
  //   <textarea class="col-8 col-md-10 description" rows="3" data-idx="9"> </textarea>
  //   <button class="btn saveBtn col-2 col-md-1" aria-label="save" data-idx="9">
  //     <i class="fas fa-save" aria-hidden="true" data-idx="9"></i>
  //   </button>
  // </div>
  //
  //
  // The following const values delimit the range of hours shows on the day's calender, per
  // the mock-up example, but can be changed to accommodate a different hour range if so desired.
  const FIRST_HOUR = 9;  // 9:00 a.m.
  const LAST_HOUR = 17;  // 5:00 p.m.
  let nowHr = dayjs().hour();  // the current hour
  for (let hr=FIRST_HOUR;hr<=LAST_HOUR;hr++) {
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
    let hourLabel = dayjs().hour(hr).minute(0).format("hA");  // format hour as "9AM", "10AM", ...
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
  }
}

function displayTodayInHeader() {
  // Uses DayJS to set the current day information in the header
  let currDayPara = document.querySelector("#currentDay");
  if (currDayPara !== null) {
    // This format indicates produces output in the form of "Thursday Aug. 3, 2023",
    // varying the specific content in accordance with the actual date.
    let dayPhrase = dayjs().format("dddd MMM[.] D, YYYY");
    currDayPara.textContent = dayPhrase;
  } else {
    currDayPara.textContent = "";
  }
}

function loadSavedCalendarInfo() {
  // Gets persisted calendar information from localStorage (key = "calendar-info")
  // and uses it to populate the textarea contents for the hours represented
  calendarInfo = JSON.parse(localStorage.getItem("calendar-info"));
  if (calendarInfo === null) {
    // If no previously stored calendar-info item was stored then start with
    // an empty array.
    calendarInfo = [];
  }
  // Each element in the calendarInfo array will represent an hour with 
  // recorded information.  Note that not all hours will have array elements.
  // For each such element, the "key" field is the hour of the day (numeric, 0-23)
  // and the "content" field is the content for the corresponding textarea.
  // Note that the stored array elements can be in any order and are not expected
  // to be chronological.
  for (let i=0;i<calendarInfo.length;i++) {
    let entry = calendarInfo[i];
    let numKey = entry.key;
    let hourKey = "hour-" + numKey;
    let content = entry.content;
    let outerDivLocal = document.querySelector("#"+hourKey);
    if (outerDivLocal !== null) {
      let txtArea = document.querySelector("#"+hourKey+ " textarea");
      if (txtArea !== null) {
        txtArea.value = content;
      }
    }
  }
}

function addHourListListeners() {
  let hourList = document.querySelector("#hour-list");
  if (hourList !== null) {
    hourList.addEventListener("click",function(event) {
      let elem = event.target;
      // If a click is detected on a save button or its child <i> element then
      // we call saveForHourKey using the value derived from the data-idx attribute.
      // e.g. if data-idx = 9 then our key will be "hour-9".
      if (elem.matches(".saveBtn") || elem.matches(".saveBtn>i")) {
        let hourKey = "hour-" + elem.getAttribute("data-idx");
        saveForHourKey(hourKey);
      }
    })
    hourList.addEventListener("change" ,function(event) {
      let elem = event.target;
      // If a change is detected in one of the textarea elements then we
      // change its style so that it is visually apparent that the element
      // has been changed but not yet saved.
      if (elem.matches("textarea")) {
        // let idx = elem.getAttribute("data-idx");  // TODO - delete this?
        elem.classList.add("unsaved");
      }
    })
  }
}

function saveForHourKey(hKey) {
  // Given an hKey parameter value which is of the form "hour-H" where H is a numeric hour of the
  // day, this functions saves the corresponding textarea content combined with the hour
  // in an object of the form {key:<hour>, content:<textarea content>} in the calendarInfo
  // array.  In doing so, care is taken not to duplicate entries for any given hour.
  //
  // Get the relevant <div> element based on the id= value 
  let div = document.querySelector("#"+hKey);  // TODO - do we even need these first two lines?
  if (div !== null) {
    let txtArea = document.querySelector("#"+hKey + " textarea");
    content = txtArea.value;
    let numKey = parseInt(hKey.substring(5));  // Ignore "hour-" and convert to numeric
    if (numKey !== null) {
      let matchingEntryFound = false;
      let matchedIdx = -1;
      // Scan all the existing entries in the calendarInfo array to determine if information for
      // the specified hour is already in that array.
      for (i=0;i<calendarInfo.length&&(!matchingEntryFound);i++) {
        matchingEntryFound = (calendarInfo[i].key === numKey);
        if (matchingEntryFound) {
          matchedIdx = i;
        }
      }
      if (matchingEntryFound) {
        // If the hour in question was already found in the array then update the
        // content thereof ONLY if it is DIFFERENT from what is already recorded.  If NOT
        // different then there is actually no change, and therefore, no need to update
        // localStorage.
        if (content !== calendarInfo[matchedIdx].content) {
          calendarInfo[matchedIdx].content = content;
          localStorage.setItem("calendar-info",JSON.stringify(calendarInfo));
        }  // else no change and no need to save
      } else {
        // If no match was found in the array then we need to add an new element to the array,
        // but only if the content to be added is not blank.
        if (content !== "") {
          calendarInfo.push({key:numKey,content:content});
          localStorage.setItem("calendar-info",JSON.stringify(calendarInfo));
        } // else no point in appending empty content - effectively a non-change
      }
      // Regardless of whether a localStorage change was needed, the "unsaved" class should be cleared
      // to signal use that nothing further is needed.
      txtArea.classList.remove("unsaved");
    }
  }
}