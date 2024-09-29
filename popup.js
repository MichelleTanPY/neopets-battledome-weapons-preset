// Add event listener to the settings button to open the options page
document.getElementById('settings').addEventListener('click', () => {
  // Use the Chrome API to open the options page
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    // Fallback for older versions of Chrome
    window.open(chrome.runtime.getURL('options.html'));
  }
});

// Retrieve and apply settings when preset1/2 button is clicked
document.getElementById('preset1').addEventListener('click', () => {
  // Retrieve stored settings for Preset 1
  chrome.storage.sync.get(['ability1', 'equipment1', 'equipment2', 'skipReplay1', 'collectRewards1'], (data) => {
      // Pass the retrieved data to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: loadEquipment,
              args: [
                  data.ability1 || '', 
                  data.equipment1 || '', 
                  data.equipment2 || '', 
                  data.skipReplay1 || false, 
                  data.collectRewards1 || false
              ]
          });
      });
  });
});

document.getElementById('preset2').addEventListener('click', () => {
  // Retrieve stored settings for Preset 2
  chrome.storage.sync.get(['ability2', 'equipment1b', 'equipment2b', 'skipReplay2', 'collectRewards2'], (data) => {
      // Pass the retrieved data to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: loadEquipment,
              args: [
                  data.ability2 || '', 
                  data.equipment1b || '', 
                  data.equipment2b || '', 
                  data.skipReplay2 || false, 
                  data.collectRewards2 || false
              ]
          });
      });
  });
});

// Function to observe changes in the DOM and detect when the #p2chat div appears
function waitForChatAndLoadEquipment() {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const chatElement = document.querySelector('#p2chat');
        if (chatElement && chatElement.textContent.includes('Betrayal... Backstabbing...')) {
          console.log("Chat detected, proceeding to load equipment.");
          loadEquipmentMenus(); // Call the function to load equipment after chat is found
          observer.disconnect(); // Stop observing after the chat element is detected
          break;
        }
      }
    }
  });

  // Start observing the body for changes to detect the #p2chat div
  observer.observe(document.body, { childList: true, subtree: true });
}
// The function that will be executed in the context of the active tab
function loadEquipment(ability, equipment1, equipment2, skipReplay, collectRewards) {
  console.log(`Settings: Ability - ${ability}, Equipment1 - ${equipment1}, Equipment2 - ${equipment2}, Skip Replay - ${skipReplay}, Collect Rewards - ${collectRewards}`);

  // Function to observe changes in the DOM and click the target button
  function observerButton(selector, callback) {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const targetElement = document.querySelector(selector);
          if (targetElement) {
            console.log(`Button appeared: ${selector}`, targetElement);
            if (callback) callback(targetElement);
            observer.disconnect();
            break;
          }
        }
      }
    });

    // Start observing the body for childList changes
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Function to observe changes in class attribute
  function observeClassChanges(original, updated, unwanted) {
    const targetElement = document.querySelector(original);
    if (targetElement) {
      const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (targetElement.classList.contains(updated) && !targetElement.classList.contains(unwanted)) {
              console.log('Class changed to .caction:', targetElement);
              targetElement.click();
              observer.disconnect();
            }
          }
        }
      });

      // Start observing the target element for attribute changes
      observer.observe(targetElement, { attributes: true });
    } else {
      console.log('Inactive .caction button not found');
    }
  }

  // Select and click items from the equipment menus based on the settings
// Select and click items from the equipment and ability menus based on user settings
const equipmentMenus = [
  { selector: 'a.menu.p1#p1e1m', itemName: equipment1, itemType: 'equipment' },
  { selector: 'a.menu.p1#p1e2m', itemName: equipment2, itemType: 'equipment' },
  { selector: 'a.menu.p1#p1am', itemName: ability, itemType: 'ability' }
];

// Iterate over the equipment and ability menus
equipmentMenus.forEach((item) => {
  const element = document.querySelector(item.selector);
  
  if (element) {
    element.click();  // Open the respective menu
    console.log(`Selecting ${item.itemName}`);
    
    // Define the selector based on the type of item (equipment or ability)
    const itemSelector = item.itemType === 'ability'
      ? document.querySelectorAll('.emenu .fsmid td')  // Abilities are in `td` elements
      : document.querySelectorAll('.emenu .fsmid .item');  // Equipment is in `.item` elements

    // Find the correct item and click it
    itemSelector.forEach(itemSelected => {
      if (itemSelected.title.includes(item.itemName)) {
        console.log(`Clicking on: ${item.itemName}`);
        itemSelected.click();

        // Special handling for abilities: Check if there's a child element with `data-ability`
        if (item.itemType === 'ability') {
          const abilityChild = itemSelected.querySelector('[data-ability]');
          if (abilityChild) {
            console.log(`Clicking on child ability: ${abilityChild.getAttribute('data-ability')}`);
            abilityChild.click();
          }
        }
      }
    });
  } else {
    console.log(`Element not found for selector: ${item.selector}`);
  }
});


  // Observe various buttons for the game and handle click actions
  observeClassChanges('.caction.inactive', "caction", "inactive");

  // If skipReplay is true, handle skipping replay
  if (skipReplay) {
    let skipOnce = 1;
    observeStatusAndSkipReplay(skipOnce);
  }

  // If collectRewards is true, handle rewards collection
  if (collectRewards) {
    observerButton("button.end_ack.collect", (el) => el.click());
  }

  // Function to observe status and skip replay
  function observeStatusAndSkipReplay(skipOnce) {
    const statusElement = document.querySelector("#statusmsg");

    // If status element is not found, return or log an error
    if (!statusElement) {
      console.error('Status message element not found.');
      return;
    }

    // Create a MutationObserver to detect changes in the status message
    const observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const currentText = statusElement.textContent.trim();
          console.log('Status message updated:', currentText);

          // Detect if the status message has become "Winner"
          if (currentText.includes("Winner")) {
            console.log('Winner message detected, clicking Skip Replay.');
            // Stop observing after "Winner" is detected
            observer.disconnect();

            // Find and click the #skipreplay button
            const skipReplayButton = document.querySelector("button#skipreplay");
            if (skipReplayButton && skipOnce) {
              setTimeout(() => {
                console.log('0.5 second delay before clicking Skip Replay.');
              }, 500); // 0.5 second delay
              console.log('Clicking Skip Replay button:', skipReplayButton);
              skipReplayButton.click();
              skipOnce--;
            } else {
              console.error('Skip Replay button not found.');
            }
          }
        }
      });
    });

    // Start observing the status element for changes
    observer.observe(statusElement, { childList: true, characterData: true, subtree: true });
  }
  waitForChatAndLoadEquipment();
}