(() => {
    let choices, box, jsonQuestions, responseArea, carousel;
    // Create a red box div
    let redBoxCreated = document.createElement("div");
    redBoxCreated.className = "red-box";
    redBoxCreated.style.position = "absolute"; // Overlay positioning
    redBoxCreated.style.left = "50%"; // Center horizontally
    redBoxCreated.style.transform = "translateX(-50%)"; // Center horizontally
    redBoxCreated.style.width = "80%"; // Make it wider
    redBoxCreated.style.maxWidth = "800px"; // Optional: limit the maximum width
    redBoxCreated.style.minHeight = "80%"; // Minimum height
    redBoxCreated.style.marginTop = "20px"; // 50px from the top
    redBoxCreated.style.borderRadius = "10px"; // Rounded corners
    redBoxCreated.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"; // Add shadow
    redBoxCreated.style.zIndex = "1000"; // Ensure it stays on top
    redBoxCreated.style.backgroundColor = "#D3D3D3"; // Light gray background color
    redBoxCreated.style.display = "flex"; // Use flexbox for centering
    redBoxCreated.style.flexDirection = "column";
    redBoxCreated.style.alignItems = "center";
    redBoxCreated.style.justifyContent = "center";
    redBoxCreated.style.padding = "20px"; // Padding for content spacing
    redBoxCreated.style.textAlign = "center"; // Center text horizontally
    
    
    // Add centered text with big font
    const header = document.createElement("h1");
    header.textContent = "Generate questions about a specific topic or text";
    header.style.fontSize = "24px"; // Big font size
    header.style.marginBottom = "20px"; // Space below the text
    redBoxCreated.appendChild(header);
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        let existingBox = document.getElementsByClassName("flex items-end gap-1.5 md:gap-2")[0];
        responseArea = document.getElementsByClassName('h-full')[10];
        console.log(responseArea);
        let historyArea = document.getElementsByClassName("flex-shrink-0 overflow-x-hidden bg-token-sidebar-surface-primary")[0];
        choices = document.getElementsByClassName("choices")[0];
        
        if (message.action === "start") {
            addChoices();
            if (responseArea && historyArea && existingBox) {
                // Save original styles
                originalStyles = {
                    existingBox: existingBox.style,
                    responseArea: responseArea.style,
                    historyArea: historyArea.style
                };
                 // Get the parent element of responseArea
                let parentElement = responseArea.parentElement;

                
                
                // Ensure the parent element has a relative position
                parentElement.style.position = "relative";
                
                // Append the red box to the parent element
                parentElement.appendChild(redBoxCreated);
                // Apply new styles
                existingBox.style.display = "none";
                responseArea.style.display = "none";
                historyArea.style.display = "none";
                console.log(responseArea)
            }
        } else if (message.action === "stop" && choices) {
            choices.remove();
            if (responseArea && historyArea && existingBox) {
                // Restore original styles
                existingBox.style = originalStyles.existingBox;
                responseArea.style = originalStyles.responseArea;
                historyArea.style = originalStyles.historyArea;

                // Remove the red box if it exists
                const redBox = document.getElementsByClassName("red-box")[0];
                if (redBox) {
                    console.log(redBox);
                    redBox.remove();
                }
            }
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
                    <textarea id="prompt-user-textarea" placeholder="Enter prompt text here..." style="
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
                box.appendChild(choices);
                const submitButton = document.getElementById("generate-questions");
                submitButton.addEventListener("click", generateQuestions);
            } else {
                console.error("Box not found!");
            }
        }
    }

    const generateQuestions = () => {
        let prompt = `Generate JSON for 2 questions about the following text: poems, generate the json and the json only without any other text. and the json should be in text format not inside a code block in the following format:
        {
   "questions":[
      {
         "question":"What is a common feature of haiku poems?",
         "choices":[
            "Three lines",
            "Four stanzas",
            "Rhyme scheme",
            "Extended metaphor"
         ],
         "correctChoice":0
      },
      {
         "question":"Which poetic form consists of 14 lines with a specific rhyme scheme?",
         "choices":[
            "Sonnet",
            "Limerick",
            "Free verse",
            "Ode"
         ],
         "correctChoice":0
      }
   ]
}`;
        
        const inputedText = document.getElementById("prompt-textarea");
        if (inputedText) {
            inputedText.value = prompt;
            const event = new Event('input', { bubbles: true });
            inputedText.dispatchEvent(event);
        }
        const existingButton = document.querySelector('button[data-testid="send-button"]');
        if (existingButton) {
            existingButton.click();
        } else {
            console.error("Send button not found!");
        }
        let redBox = document.getElementsByClassName("red-box")[0];
        let headerRedBox = redBox.getElementsByTagName("h1")[0];
        headerRedBox.textContent = "Waiting for response...";   
        console.log("Waiting for response...");
        setTimeout(() => {
            getResponse();
        }, 10000);
    }

    const getResponse = () => {
        let responses = document.getElementsByClassName("w-full text-token-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-4px]");
        let response = responses[responses.length - 1];
        console.log(response.getElementsByTagName("p"));
        let responseText = response.getElementsByTagName("p")[0].innerText;
        console.log(responseText);
        try {
            jsonQuestions = JSON.parse(responseText);
            console.log(jsonQuestions);
        } catch (error) {
            console.error("Failed to parse response:", error);
        }

       
        displayCarousel(jsonQuestions.questions);
    }

    let index = 0;

    const displayCarousel = questions => {
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'carousel-container';
        carouselContainer.style.position = "relative";
        carouselContainer.style.backgroundColor = "#D3D3D3";
        carouselContainer.style.borderRadius = "10px";
        carouselContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        carouselContainer.style.padding = "20px";
        carouselContainer.style.maxWidth = "800px";
        carouselContainer.style.overflow = "hidden";
        carouselContainer.style.width = "100%";
        let redBox = document.getElementsByClassName("red-box")[0];
        let headerRedBox = redBox.getElementsByTagName("h1")[0];
        headerRedBox.remove();
        redBox.body.appendChild(carouselContainer);

        const nextSlide = () => {
            const totalSlides = questions.length;
            if (index < totalSlides - 1) {
                index++;
                updateCarousel();
            }
        };

        const prevSlide = () => {
            if (index > 0) {
                index--;
                updateCarousel();
            }
        };

        const updateCarousel = () => {
            carousel = document.getElementsByClassName('carousel-container')[0];
            let carouselContent = `
                <div class="carousel-slide">
                    <h3>${questions[index].question}</h3>
                    <div class="choices" style="display:flex; flex-direction:column; justify-content:space-between; height:25vh; margin:20px">
                        ${questions[index].choices
                          .map(
                            (choice, i) => `
                            <label style="display:block; margin-bottom: 8px;">
                                <input type="radio" name="c${i}" value="${i}" style="margin-right: 8px;"> ${choice}
                            </label>`
                          )
                          .join('')}
                    </div>
                </div>`;

            carousel.innerHTML = `
                <div class="carousel">${carouselContent}</div>
                <div class="btn-container" style="text-align: center; margin-top: 20px;">
                    <button class="btn" id="prevBtn" style="
                        background: #007aff;
                        color: #fff;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        margin-right: 10px;
                        transition: background 0.3s ease;
                    ">Previous</button>
                    <button class="btn" id="nextBtn" style="
                        background: #007aff;
                        color: #fff;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                    ">Next</button>
                </div>`;
            const redBox = document.getElementsByClassName("red-box")[0];
            if (redBox) {
                redBox.appendChild(carousel);
            }
            const nextBtn = document.getElementById('nextBtn');
            const prevBtn = document.getElementById('prevBtn');
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
        };
        updateCarousel();
    };
})();
