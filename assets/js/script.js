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
  calendarInfo = JSON.parse(localStorage.getItem("calendar-info"));
  if (calendarInfo === null) {
    calendarInfo = [];
  }
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
      if (elem.matches(".saveBtn") || elem.matches(".saveBtn>i")) {
        let hourKey = "hour-" + elem.getAttribute("data-idx");
        saveForHourKey(hourKey);
      }
    })
    hourList.addEventListener("change" ,function(event) {
      let elem = event.target;
      if (elem.matches("textarea")) {
        let idx = elem.getAttribute("data-idx");
        elem.classList.add("unsaved");
      }
    })
  }
}

function saveForHourKey(hKey) {
  let div = document.querySelector("#"+hKey);
  if (div !== null) {
    let txtArea = document.querySelector("#"+hKey + " textarea");
    content = txtArea.value;
    let numKey = parseInt(hKey.substring(5));  // Ignore "hour-" and convert to numeric
    if (numKey !== null) {
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
          calendarInfo[matchedIdx].content = content;
          localStorage.setItem("calendar-info",JSON.stringify(calendarInfo));
        }  // else no change and no need to save
      } else {
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