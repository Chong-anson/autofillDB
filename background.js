chrome.runtime.onInstalled.addListener(function () {
  console.log("Installed succesffully")
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'www.interview-db.com' },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
