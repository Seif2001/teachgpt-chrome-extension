(() => {
    let choices, box;
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        choices = document.getElementsByClassName("choices")[0];
        if (message.action === "start") {
            addChoices();
        }
        else if (message.action === "stop" && choices) {
            choices.remove();
        }
        sendResponse({status: "OK"});
    });

    const addChoices = () => {
        const choicesExists = document.getElementsByClassName("choices");
        if (choicesExists.length === 0) {
            // Create the choices div
            choices = document.createElement("div");
            choices.className = "choices";
            
            // Add the choices and number input box to the inner HTML
            choices.innerHTML = `
                <select id="choices-select">
                    <option value="mcq">Multiple Choice</option>
                    <option value="tf">True or False</option>
                </select>
                <input id="number-input" type="number" placeholder="Enter number" min="0" style="margin-top: 10px;" />
            `;

            // Append dropdown and number input to the target box
            box = document.getElementsByClassName("flex w-full flex-col gap-1.5 rounded-[26px] p-1.5 transition-colors bg-[#f4f4f4] dark:bg-token-main-surface-secondary")[0];
            box.appendChild(choices);
            console.log(box);
        }
    }
})();
