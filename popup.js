
function processInput(input) {
  return input.map((el) => {
    let pointer = el.length - 1;

    while (pointer >= 0 && el[pointer] === " ") {
      pointer -= 1;
    }

    return el.slice(0, pointer + 1);
  }).filter(el => el.length > 0);
}

function sendMessage(request) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
      console.log(response.status);
    });
  });
}

// adding listener to input
function listener(element, event, handler) {
  element.addEventListener(event, handler, false);
}

function autoResize() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + 5 + "px";
}

function delayResize(event) {
  window.setTimeout(autoResize.bind(this), 0);
}

const container = document.getElementById("fill-columns");
const select = document.getElementById("fill-option");
const resetButton = document.getElementById("reset");
const oneClickButton = document.getElementById("oneClick");
const removeAllButton = document.getElementById("removeAll");
const submitButton = document.getElementById("submit");
const sourceUrl = document.getElementById("source");

sourceUrl.addEventListener("click", (event) => {
  event.preventDefault();
  chrome.tabs.create({
      url: event.target.href,
    });
});

select.onchange = function (event) {
  let inputs = [];
  container.innerHTML = "";

  let types = ["contacts", "companies", "category"];
  if (event.target.value === "applications") {
    types = ["companies", "titles", "jobBoards"];
  }

  for (let i = 0; i < 3; i++) {
    let label = document.createElement("label");
    label.innerText = types[i];
    if (types[i] === "category") label.innerText += " default: clearbit";
    let input = document.createElement("textarea");
    input.id = "input-" + types[i];
    input.className = "form-control"
    inputs.push(input);
    input.oninput = autoResize;
    label.append(input);
    container.append(label);
  }
};

submitButton.onclick = function (e) {
  const inputs = Array.from(document.getElementsByClassName("form-control"));
  let processedInputs = inputs.map((input) =>
    processInput(input.value.split("\n"))
  )

  console.log(processedInputs[2]);
  if (select.value === "networking") {
    if (processedInputs[2].length === 0) {
      console.log("test")
      processedInputs[2].push("clearbit");
    }

    request = {
      type: "networking",
      contacts: processedInputs[0],
      companies: processedInputs[1],
      categories: processedInputs[2],
    };
  } else if (select.value === "applications") {
    request = {
      type: "applications",
      companies: processedInputs[0],
      titles: processedInputs[1],
      jobBoards: processedInputs[2],
    };
  }
  sendMessage(request);
};

resetButton.onclick = function (e) {
  container.innerHTML = "";
  select.selectedIndex = 0;
};

oneClickButton.onclick = function (e) {
  sendMessage({ type: "oneClick" });
};

removeAllButton.onclick = function (e) {
  sendMessage({ type: "removeAll" });
};
