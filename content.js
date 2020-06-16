function setNativeValue(element, value) {
  let lastValue = element.value;
  element.value = value;
  let event = new Event("input", { target: element, bubbles: true });
  let tracker = element._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  element.dispatchEvent(event);
}

function selectValue(element, value) {
  let lastValue = element.value;
  element.value = value;
  let event = new Event("change", { target: element, bubbles: true });
  let tracker = element._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  element.dispatchEvent(event);
}

function oneClick() {
  const companiesInput = Array.from($("input")).filter((el) =>
    el.id.match(/react-select-[0-9]+-input/)
  );
  const N = companiesInput.length;
  if (companiesInput.length === 0) {
    return "there is nothing to click";
  }
  const companiesId = parseInt(
    companiesInput[0].id.split("-").filter((el) => el.match(/[0-9]+/))
  );

  for (let i = 0; i < N; i++) {
    let currentId = companiesId + i;
    const el = document.getElementById(`react-select-${currentId}-option-0`);
    let clicked = false;

    if (el !== null) {
      if (el.innerText !== companiesInput[i].value) {
        const inputs = Array.from($(`#react-select-${currentId}-option-0 ~`));

        inputs.forEach((innerEl) => {
          if (innerEl.innerText === `Create "${companiesInput[i].value}"`) {
            innerEl.click();
            clicked = true;
          }
        });
      }
      if (!clicked) {
        el.click();
      }
    }
  }
}

function removeAll() {
  let buttons = Array.from($(".btn.btn-danger.array-item-remove"));
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[buttons.length - 1 - i] !== null)
      buttons[buttons.length - 1 - i].click();
  }
}

function fillNetworking(names, companies, N = 25, types = []) {
  for (let i = 0; i < N; i++) {
    $("#root_networkingConnections__title ~.row button.btn-add")[0].click();
  }
  // categories
  let startingId = parseInt(
    $("select")[0]
      .id.split("_")
      .filter((el) => el.match(/[0-9]+/))
  );

  Array.from($("select")).forEach((el, idx) => {
    selectValue(el, types[idx] || types[0]);
  });

  //filling names
  for (let i = 0; i < N; i++) {
    let input = document.getElementById(
      `root_networkingConnections_${startingId + i}_contact`
    );
    setNativeValue(input, names[i]);
  }

  // filling companies
  let input = Array.from($("input")).filter((el) =>
    el.id.match(/react-select-[0-9]+-input/)
  );
  let companiesId = parseInt(
    input[0].id.split("-").filter((el) => el.match(/[0-9]+/))
  );

  for (let i = 0; i < N; i++) {
    let input = document.getElementById(
      `react-select-${companiesId + i}-input`
    );
    setNativeValue(input, companies[i]);
  }

  window.setTimeout(() => {
    oneClick();
  }, 5000);
}

function fillApplications(companies, titles, jobBoards, N = 25) {
  for (let i = 0; i < N; i++) {
    $("#root_applications__title ~.row button.btn-add")[0].click();
  }

  let companiesInput = Array.from($("input")).filter((el) =>
    el.id.match(/react-select-[0-9]+-input/)
  );
  let companiesId = parseInt(
    companiesInput[0].id.split("-").filter((el) => el.match(/[0-9]+/))
  );
  // filling companies
  for (let i = 0; i < N; i++) {
    let companiesInput = document.getElementById(
      `react-select-${companiesId + 2 * i}-input`
    );
    let jobBoardsInput = document.getElementById(
      `react-select-${companiesId + 2 * i + 1}-input`
    );
    setNativeValue(companiesInput, companies[i]);
    setNativeValue(jobBoardsInput, jobBoards[i]);
  }

  //filling titiles
  let titlesInput = Array.from($("input")).filter((el) =>
    el.id.includes("jobTitle")
  );
  let titlesId = parseInt(
    titlesInput[0].id.split("_").filter((el) => el.match(/[0-9]/))
  );
  for (let i = 0; i < N; i++) {
    let input = document.getElementById(
      `root_applications_${titlesId + i}_jobTitle`
    );
    setNativeValue(input, titles[i]);
  }

  window.setTimeout(() => {
    oneClick();
  }, 5000);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "applications":
      var { companies, titles, jobBoards } = request;
      fillApplications(companies, titles, jobBoards, companies.length);
      break;
    case "networking":
      let { contacts, categories } = request;
      fillNetworking(contacts, request.companies, contacts.length, categories);
      break;
    case "oneClick":
      oneClick();
      break;
    case "removeAll":
      removeAll();
      break;
    default:
      console.log("invalid type");
  }

  sendResponse({ status: "goodbye" });
});
