chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.update(tab.id, {
    url: "https://www.neopets.com/dome/fight.phtml",
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: clickNextStep,
  });
});

function clickNextStep() {
  const nextStepElement = document.querySelector(".nextStep");
  if (nextStepElement) {
    nextStepElement.click();
  }
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: clickWandOfTheDarkFaerie,
  });
});

function clickWandOfTheDarkFaerie() {
  const items = document.querySelectorAll(".emenu .fsmid .item");
  items.forEach((item) => {
    if (item.title.includes("Wand of the Dark Faerie")) {
      item.click();
    }
  });
}
