(() => {
    let choices, box;
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        let existingBox = document.getElementsByClassName("flex items-end gap-1.5 md:gap-2")[0];
        let responseArea = document.getElementsByClassName("flex flex-col text-sm md:pb-9")[0];
        let historyArea = document.getElementsByClassName("flex-shrink-0 overflow-x-hidden bg-token-sidebar-surface-primary")[0];
        choices = document.getElementsByClassName("choices")[0];
        if (message.action === "start") {
            addChoices();
            existingBox.style.display = "none";
            responseArea.style.display = "none";
            historyArea.style.display = "none";
        } else if (message.action === "stop" && choices) {
            choices.remove();
            existingBox.style.display = "flex";
            responseArea.style.display = "flex";
            historyArea.style.display = "flex";
        }
        sendResponse({ status: "OK" });
    });

    const addChoices = () => {
        const choicesExists = document.getElementsByClassName("choices");
        if (choicesExists.length === 0) {
            // Create the choices div
            choices = document.createElement("div");
            choices.className = "choices";
            
            // Add the choices, number input box, and text area to the inner HTML
            choices.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <select id="choices-select" style="
                        background-color: #f4f4f4;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 8px;
                        font-size: 14px;
                        width: 100%;
                        box-sizing: border-box;
                        transition: border-color 0.3s ease;
                    ">
                        <option value="mcq">Multiple Choice</option>
                        <option value="tf">True or False</option>
                    </select>
                </div>
                <div style="margin-bottom: 10px;">
                    <input id="number-input" type="number" placeholder="Enter number" min="0" style="
                        background-color: #f4f4f4;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 8px;
                        font-size: 14px;
                        width: 100%;
                        box-sizing: border-box;
                        transition: border-color 0.3s ease;
                    " />
                </div>
                <div style="margin-bottom: 10px;">
                    <textarea id="prompt-textarea" placeholder="Enter prompt text here..." style="
                        background-color: #f4f4f4;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 10px;
                        font-size: 14px;
                        width: 100%;
                        height: 80px;
                        box-sizing: border-box;
                        transition: border-color 0.3s ease;
                        resize: none;
                    "></textarea>
                </div>
                <div id="generate-questions" 
                    style="
                        display: inline-block; /* Make the div behave like a button */
                        background: linear-gradient(135deg, #4a90e2, #007aff); 
                        color: #fff; 
                        padding: 10px 20px; 
                        border: none; 
                        border-radius: 26px; 
                        font-size: 16px; 
                        font-weight: bold; 
                        cursor: pointer;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        transition: all 0.3s ease;
                        text-align: center;
                        margin-top: 20px; /* Space above the button */
                    "
                    class="hover:bg-[#007aff] hover:scale-105"
                >
                    Generate Questions
                </div>`;

            // Append dropdown, number input, and text area to the target box
            box = document.getElementsByClassName("flex w-full flex-col gap-1.5 rounded-[26px] p-1.5 transition-colors bg-[#f4f4f4] dark:bg-token-main-surface-secondary")[0];
            if (box) {
                choices.style.display = "flex";
                choices.style.flexDirection = "column";
                // choices.style.alignItems = "center";
                // choices.style.textAlign = "center";
                box.appendChild(choices);
                const submitButton = document.getElementById("generate-questions");
                submitButton.addEventListener("click", generateQuestions);
                console.log(box);
            } else {
                console.error("Box not found!");
            }
        }
    }

    const generateQuestions = () => {
        const numberOfQuestions = document.getElementById("number-input").value;
        const questionType = document.getElementById("choices-select").value;
        const inputedText = document.getElementById("prompt-textarea");
        const promptText = inputedText ? inputedText.value : "No text found!";
        let responses = document.getElementsByClassName("w-full text-token-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-4px]")
        let response = responses[responses.length - 1];
        let responseText = response.getElementsByTagName("p")[0].innerText;
        console.log(responseText);
        if (inputedText) {
            inputedText.value = "hi";
            const event = new Event('input', { bubbles: true });
            inputedText.dispatchEvent(event);
        }
        const existingButton = document.querySelector('button[data-testid="send-button"]');
        
        if (existingButton) {
            existingButton.click();
        } else {
            console.error("Send button not found!");
        }
        
        console.log(promptText);
    }
})();
