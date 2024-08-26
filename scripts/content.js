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
        text-align: center; /* Center text */
    "
    class="hover:bg-[#007aff] hover:scale-105"
>
    Generate Questions
</div>`;


            // Append dropdown and number input to the target box
            box = document.getElementsByClassName("flex w-full flex-col gap-1.5 rounded-[26px] p-1.5 transition-colors bg-[#f4f4f4] dark:bg-token-main-surface-secondary")[0];
            box.appendChild(choices);
            const submitButton = document.getElementById("generate-questions");
            submitButton.addEventListener("click", generateQuestions);
            console.log(box);
        }
    }

    const generateQuestions = () => {
        const numberOfQuestions = document.getElementById("number-input").value;
        const questionType = document.getElementById("choices-select").value;
        const inputedText = document.getElementById("prompt-textarea")
        const promptText = inputedText.value;
        inputedText.value = "hi";
        console.log(promptText);
    }
})();
