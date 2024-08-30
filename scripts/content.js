(() => {

    
    let started = false;
    let choices, box, jsonQuestions, responseArea, carousel, originalStyles, existingBox, historyArea, redBox;
    const addChoices = () => {
        const choicesExists = document.getElementsByClassName("choices");
        if (choicesExists.length === 0) {
            // Create the choices div
            choices = document.createElement("div");
            choices.className = "choices";
            
            // Add the choices, number input box, and text area to the inner HTML
            choices.innerHTML = `
                <div style="margin-bottom: 12px;">
                    <select id="choices-select" style="
                        background-color: #e0f7fa;
                        border: 1px solid #0097a7;
                        border-radius: 8px;
                        padding: 10px;
                        font-size: 16px;
                        width: 100%;
                        box-sizing: border-box;
                        transition: border-color 0.3s ease;
                    ">
                        <option value="mcq">Multiple Choice</option>
                        <option value="tf">True or False</option>
                    </select>
                </div>
                <div style="margin-bottom: 12px;">
                    <input id="number-input" type="number" placeholder="Enter number" min="0" style="
                        background-color: #e0f7fa;
                        border: 1px solid #0097a7;
                        border-radius: 8px;
                        padding: 10px;
                        font-size: 16px;
                        width: 100%;
                        box-sizing: border-box;
                        transition: border-color 0.3s ease;
                    " />
                </div>
                <div style="margin-bottom: 12px;">
                    <textarea id="prompt-user-textarea" placeholder="Enter prompt text here..." style="
                        background-color: #e0f7fa;
                        border: 1px solid #0097a7;
                        border-radius: 8px;
                        padding: 12px;
                        font-size: 16px;
                        width: 100%;
                        height: 100px;
                        box-sizing: border-box;
                        transition: border-color 0.3s ease;
                        resize: none;
                    "></textarea>
                </div>
                <div id="generate-questions" 
                    style="
                        display: inline-block; /* Make the div behave like a button */
                        background: linear-gradient(135deg, #00796b, #004d40); 
                        color: #fff; 
                        padding: 12px 24px; 
                        border: none; 
                        border-radius: 28px; 
                        font-size: 18px; 
                        font-weight: bold; 
                        cursor: pointer;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                        transition: all 0.3s ease;
                        text-align: center;
                        margin-top: 24px; /* Space above the button */
                    "
                    class="hover:bg-[#004d40] hover:scale-105"
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
    };
    const start = () => {
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
        header.style.fontSize = "26px"; // Big font size
        header.style.marginBottom = "24px"; // Space below the text
        header.style.color = "#004d40"; // Dark teal color

        existingBox = document.getElementsByClassName("flex items-end gap-1.5 md:gap-2")[0];

        redBoxCreated.appendChild(header);


        //responseArea = ;
        responseArea = document.getElementsByClassName("flex flex-col text-sm md:pb-9")[0] ?? document.getElementsByClassName('h-full')[9] ?? document.getElementsByClassName('h-full')[10];
        historyArea = document.getElementsByClassName("flex-shrink-0 overflow-x-hidden bg-token-sidebar-surface-primary")[0];
        choices = document.getElementsByClassName("choices")[0];
        if (responseArea && historyArea && existingBox) {
            addChoices();
            // Save original styles
            originalStyles = {
                existingBox: existingBox.style,
                responseArea: responseArea.style,
                historyArea: historyArea.style
            };
            console.log("adding red box");
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
            console.log(responseArea);
        }
    }

    const stop = () => {
        existingBox = document.getElementsByClassName("flex items-end gap-1.5 md:gap-2")[0];
        //responseArea = document.getElementsByClassName('h-full')[9];
        historyArea = document.getElementsByClassName("flex-shrink-0 overflow-x-hidden bg-token-sidebar-surface-primary")[0];
        if (responseArea && historyArea && existingBox ) {
            choices.remove();

            // Restore original styles
            existingBox.style = originalStyles.existingBox;
            responseArea.style = originalStyles.responseArea;
            historyArea.style = originalStyles.historyArea;

            // Remove the red box if it exists
            redBox = document.getElementsByClassName("red-box")[0];
            if (redBox) {
                redBox.remove();
            }
        }
    }
    


    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "start"&& !started) {
            try {
                started = true;
                start();
            }
            catch(error){
                alert("An error occured while starting the extension. Please try again.");
                return;
            }
            
        } else if (message.action === "stop") {
            stop();
        }
        sendResponse({ status: "OK" });
    });


    let index = 0;
    let answers;
    let checking = false;
    let correctAnswers = 0;
    let score;
    let startOfprompt = `Generate JSON for `
    let midOfPrompt = ` questions about the following text: `
    let restOfPrompt = `, generate the json and the json only without any other text. and the json should be in text format not inside a code block in the following format:
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
    }  make sure that the generated output is json and the json only without any other text.`;
    
    const displayCarousel = questions => {
        answers = new Array(questions.length).fill(-1);
        const carouselContainer = document.createElement("div");
        carouselContainer.className = "carousel-container";
        carouselContainer.style.position = "absolute";
        carouselContainer.style.top = "50%";
        carouselContainer.style.left = "50%";
        carouselContainer.style.transform = "translate(-50%, -50%)";
        carouselContainer.style.width = "80%";
        carouselContainer.style.maxWidth = "600px";
        carouselContainer.style.backgroundColor = "#ffffff";
        carouselContainer.style.borderRadius = "12px";
        carouselContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        carouselContainer.style.padding = "24px";
        carouselContainer.style.textAlign = "center";

        let redBox = document.getElementsByClassName("red-box")[0];
        let headerRedBox = redBox.getElementsByTagName("h1")[0];
        headerRedBox.style.display = "none";
        redBox.appendChild(carouselContainer);

   
        const nextSlide = () => {
            const totalSlides = questions.length;
            
            if (index < totalSlides - 1) {
                const carousel = document.getElementsByClassName('carousel-container')[0];

                const selectedOption = carousel.querySelector('input[name="choices"]:checked');
                if (selectedOption) {
                    answers[index] = selectedOption.value;
                    console.log(answers);
                }
                index++;
                updateCarousel();
            }
        };

        const prevSlide = () => {
            if (index > 0) {
                const carousel = document.getElementsByClassName('carousel-container')[0];
                const selectedOption = carousel.querySelector('input[name="choices"]:checked');
                if (selectedOption) {
                    answers[index] = selectedOption.value;
                    console.log(answers);
                }
                index--;
                updateCarousel();
            }
        };
        
        const updateCarousel = () => {
            console.log(answers);
            console.log(index);
            
            let carousel = document.getElementsByClassName('carousel-container')[0];
            let carouselContent = `
                <div class="carousel-slide">
                    <h3 style="color: #004d40">${(index+1) + '. '+ questions[index].question} </h3>
                    <div class="choices" style="display:flex; flex-direction:column; justify-content:space-between; align-items: flex-start; height:25vh; margin:20px">
                        ${questions[index].choices
                          .map(
                            (choice, i) => `
                            ${checking &&  questions[index].correctChoice === i ?
                            '<label style = "display: flex; align-items: center; margin-bottom: 8px; background: green; cursor:pointer; width:100%; box-sizing: border-box; padding: 8px; text-align: left; border-radius:10px; color:black;">'
                            :  '<label style = "display: flex; align-items: center; margin-bottom: 8px; background: #A0C8C8; cursor:pointer; width:100%; box-sizing: border-box; padding: 8px; text-align: left; border-radius:10px; color:black;">'}
                                ${
                                !checking ? 
                                `<input  ${Number(answers[index]) === i ? 'checked' : ''} type="radio" name="choices" value="${i}" style="margin-right: 8px; "> ${choice}` : 
                                `<input ${Number(answers[index]) === i ? 'checked' : ''} disabled type="radio" name="choices" value="${i}" 
                                style="margin-right: 8px;${ questions[index].correctChoice === i  ? 'border: 2px solid green;' : ''} " > ${choice}`
                                }
                            </label>`
                          )
                          .join('')}
                    </div>
                </div>`;

            carousel.innerHTML = `
                <div class="carousel">${carouselContent}</div>
                <div class="btn-score" style="display: flex; flex-direction:column; justify-content: space-between; align-items: center; margin-top: 20px;">
                <div class="btn-container" style="text-align: center; margin-top: 20px; display: flex; justify-content: space-around">
                    <button class="btn" id="prevBtn" style="
                        background: #004d40;
                        color: #fff;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        margin-right: 10px;
                        transition: background 0.3s ease;
                    ">Previous</button>
                    <button class="btn" id="submitBtn" style="
                        background: #004d40;
                        color: #fff;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                        margin-right: 10px;

                        display: none;
                    ">Check Answers</button>
                    <button class = "btn" id="resetBtn" style="
                    background: #004d40;
                        color: #fff;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                        display: none;
                        margin-right: 10px;
                        ">Reset Questions</button>
                        <button class="btn" id="nextBtn" style="
                        background: #004d40;
                        color: #fff;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                    ">Next</button>
                    
                </div>
                <h1 class="score" style="display:${checking? 'block' : 'none'}; font-size: 26px; margin-top: 20px; color: #004d40;"></h1>
                </div>
                `;
            score = document.getElementsByClassName('score')[0];
            const checkAnswersBtn = document.getElementById('submitBtn');
            checkAnswersBtn.addEventListener('click', checkAnswers);
            const resetBtn = document.getElementById('resetBtn');

            resetBtn.addEventListener('click', () => {
                answers = new Array(questions.length).fill(-1);
                index = 0;
                correctAnswers = 0;
                checking = false;
                updateCarousel();
            });

            const redBox = document.getElementsByClassName("red-box")[0];
            if (redBox) {
                redBox.appendChild(carousel);
            }
            const nextBtn = document.getElementById('nextBtn');
            const prevBtn = document.getElementById('prevBtn');
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
            const totalSlides = questions.length;

            if (index === totalSlides - 1 && !checking) {
                checkAnswersBtn.style.display = "block";
            }
            if (checking) {
                
                score.style.display = "block";
                resetBtn.style.display = "block";
                console.log(score)
            }
            else{
                score.style.display = "none";
                resetBtn.style.display = "none";

            }
            
        };
        const checkAnswers = () => {
            checking = true;
            let carousel = document.getElementsByClassName('carousel-container')[0];

            const selectedOption = carousel.querySelector('input[name="choices"]:checked');
                if (selectedOption) {
                    answers[index] = selectedOption.value;
                    console.log(index);
                }
                console.log("Last slide", answers, index, selectedOption);
            index = 0;
            
            questions.forEach((question, i) => {
                if (Number(question.correctChoice) === Number(answers[i])) {
                    correctAnswers++;
                }
            });
            
            try {
                updateCarousel();
            }
            catch(error){
                alert("An error occured while generating the questions. Please try again.");
                return;
            }

            score.textContent = `You got ${correctAnswers} out of ${questions.length} questions correct!`;
            console.log(correctAnswers);
        };
       try {
            updateCarousel();
        }
        catch(error){
            alert("An error occured while generating the questions. Please try again.");
            return;
        }
    };

    const getResponse = () => {
        let generateButton = document.getElementById("generate-questions");
        if (generateButton) {
            generateButton.style.pointerEvents = "auto";
            generateButton.style.opacity = "1"; // Optional: To visually indicate that the button is disabled
        }
        checking = false;
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
        
        try {
            displayCarousel(jsonQuestions.questions);
        }
        catch(error){
            alert("An error occured while generating the questions. Please try again.");
            return;
        }
    
    }

    const generateQuestions = () => {
        index = 0;
        answers;
        checking = false;
        correctAnswers = 0;

        const inputedText = document.getElementById("prompt-textarea");
        const choicesSelect = document.getElementById('choices-select');
        const numberInput = document.getElementById('number-input');
        const promptTextarea = document.getElementById('prompt-user-textarea');

        if (!choicesSelect || !numberInput || !promptTextarea) {
            console.error("One or more form elements are missing!");
            return;
        }

        const typeOfQuestions = choicesSelect.value;
        const numberOfQuestions = parseInt(numberInput.value, 10);
        const promptText = promptTextarea.value.trim();

        if (isNaN(numberOfQuestions) || numberOfQuestions < 1 || numberOfQuestions > 10) {
            alert("Please enter a number between 1 and 10.");
            return;
        }

        if (!promptText) {
            alert("Please enter the prompt text.");
            return;
        }

        let finalPrompt = startOfprompt + numberOfQuestions+ " "+typeOfQuestions + midOfPrompt + promptText + restOfPrompt;

        if (inputedText) {
            inputedText.value = finalPrompt;
            const event = new Event('input', { bubbles: true });
            inputedText.dispatchEvent(event);
        }
        let generateButton = document.getElementById("generate-questions");
        if (generateButton) {
            generateButton.style.pointerEvents = "none";
            generateButton.style.opacity = "0.5"; // Optional: To visually indicate that the button is disabled
        }
        const existingButton = document.querySelector('button[data-testid="send-button"]');
        if (existingButton) {
            existingButton.click();
        } else {
            console.error("Send button not found!");
        }
        let carousel = document.getElementsByClassName("carousel-container")[0];
        if (carousel) {
            carousel.remove();
        }
        redBox = document.getElementsByClassName("red-box")[0];
        let headerRedBox = redBox.getElementsByTagName("h1")[0];
        headerRedBox.style.display = "block";
        headerRedBox.textContent = "Waiting for response...";   
        console.log("Waiting for response...");
        console.log(headerRedBox)
        const waitDivs = document.getElementsByClassName("sr-only");
        let waitDiv = waitDivs[waitDivs.length - 2];
        console.log(waitDiv);
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (waitDiv.innerText.trim() === ''){
                
                setTimeout(() => {
                    if (waitDiv.innerText.trim() === '') {
                        observer.disconnect(); // Stop observing when there's no text
                        getResponse(); // Check again after 2 seconds
                    }
                }, 3000); // Wait for 2 seconds
            }
            }
            });
            
        // Start observing the element for changes to its child nodes and text content
        observer.observe(waitDiv, { childList: true, subtree: true, characterData: true });
        }
    
        
    

    
    
    

    
})();
