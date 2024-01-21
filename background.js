// background.js

// Function to query the Hugging Face API
async function query(data) {
    const response = await fetch("https://api-inference.huggingface.co/models/ealvaradob/bert-finetuned-phishing", {
        headers: { Authorization: "Bearer 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" },
        method: "POST",
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("API Response:", result);
    return result;
}

function processApiResponse(apiResponse) {
    if (apiResponse && Array.isArray(apiResponse) && apiResponse.length > 0 
        && Array.isArray(apiResponse[0]) && apiResponse[0].length > 0) {
        const sortedResults = apiResponse[0].sort((a, b) => b.score - a.score);
        const topResult = sortedResults[0];
        return `Detected: ${topResult.label} (Confidence: ${topResult.score.toFixed(2)})`;
    }
    return "No conclusive result";
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "checkEmail") {
        // Send a message to the content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "fetchEmailText"}, function(response) {
                if(response.emailText){
                    query({inputs: response.emailText}).then(apiResponse => {
                        let result = processApiResponse(apiResponse);
                        sendResponse({result: result});
                    }).catch(error => {
                        console.error("Error querying the API:", error);
                        sendResponse({result: "Error occurred"});
                    });
                }
            });
        });

        return true; // Keep the message channel open for the async response
    }
});
