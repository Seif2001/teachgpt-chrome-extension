chrome.runtime.onInstalled.addListener(async() => {
    chrome.action.setBadgeText({
      text: "OFF"
    });
    
  });
  
  const chatgpt = 'https://chatgpt.com/';
  
  chrome.action.onClicked.addListener(async (tab) => {
    await chrome.scripting.executeScript({target: {tabId: tab.id}, files: ["scripts/content.js"]});

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
        chrome.tabs.sendMessage(tab.id, { action: "stop" });
        }   
    }
});
 
  