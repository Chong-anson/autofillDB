const container = document.getElementById("fill-columns");
const select = document.getElementById("fill-option");
const resetButton = document.getElementById("reset");
const oneClickButton = document.getElementById("oneClick");
const removeAllButton = document.getElementById("removeAll");

function processInput(input) {
  return input.map( (el) => {
    let pointer = el.length - 1;
   
    while (pointer >= 0 && el[pointer] === " ") {
      pointer -= 1;
    }

    return el.slice(0, pointer + 1);
  })
}

function sendMessage(request) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
      console.log(response.status);
    });
  });
}

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
    let input = document.createElement("textarea")
    input.id = "input-" + types[i];
    inputs.push(input);
    label.append(input);
    container.append(label);
  }

  let button = document.createElement("button");
  button.innerText = "Submit";
  container.append(button);
  
  button.onclick = function (e) {
    console.log(inputs);
    let processedInputs = inputs.map( input => processInput(input.value.split("\n")));
    let request; 

    if (event.target.value === "networking") {
      if (processedInputs[2].length === 0) {
        processedInputs[2].push("clearbit");
      }

      request = {
        type: "networking",
        contacts: processedInputs[0],
        companies: processedInputs[1],
        categories: processedInputs[2]
      }
    } else if (event.target.value === "applications") {
      request = {
        type: "applications",
        companies: processedInputs[0],
        titles: processedInputs[1],
        jobBoards: processedInputs[2]
      }
    }

    sendMessage(request);
  }
}

resetButton.onclick = function (e) {
  container.innerHTML = "";
  select.selectedIndex = 0;
}

oneClickButton.onclick = function (e) {
  sendMessage({ type: "oneClick" })
}

removeAllButton.onclick = function (e) {
  sendMessage({ type: "removeAll" })
}