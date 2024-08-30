let started = false;

chrome.runtime.onInstalled.addListener(async() => {
    chrome.action.setBadgeText({
      text: "OFF"
    });
    
  });
  
  const chatgpt = 'https://chatgpt.com/';
  
  chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(chatgpt) && !started) {
      await chrome.scripting.executeScript({target: {tabId: tab.id}, files: ["scripts/content.js"]});
      started = true;
    }

    if (tab.url.startsWith(chatgpt)) {
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState === "OFF" ? "ON" : "OFF";
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState
        });

        if(nextState === "ON"){
            chrome.tabs.sendMessage(tab.id, { action: "start" });
        }
        else{
          started = false;
        chrome.tabs.sendMessage(tab.id, { action: "stop" });
        }   
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.status === "ERROR") {
      chrome.action.setBadgeText({
        tabId: sender.tab.id,
        text: "OFF"
      });
    }
  }
);
 
  