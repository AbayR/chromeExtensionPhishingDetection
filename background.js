// background.js

// Function to query the Hugging Face API
async function query(data) {
    console.log("Sending to API:", data);
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/ealvaradob/bert-finetuned-phishing", {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("API Response:", result);
        return result;
    } catch (error) {
        console.error("Error querying the API:", error);
        throw new Error("API query failed");
    }
}

function processApiResponse(apiResponse) {
    console.log("Processing API Response:", apiResponse);
    try {
        console.log("Processing API Response:", apiResponse); // Debug: log the raw API response

        if (apiResponse && Array.isArray(apiResponse) && apiResponse.length > 0 
            && Array.isArray(apiResponse[0]) && apiResponse[0].length > 0) {

            const sortedResults = apiResponse[0].sort((a, b) => b.score - a.score);
            const topResult = sortedResults[0];

            console.log("Top Result:", topResult); // Debug: log the top result

            // Assuming the labels are 'benign' for safe and 'phishing' for phishing
            if (topResult.label === "benign") {
                return `No phishing detected (Confidence: ${topResult.score.toFixed(2)})`;
            } else if (topResult.label === "phishing") {
                return `Phishing detected (Confidence: ${topResult.score.toFixed(2)})`;
            }
        } else if (apiResponse.status === "loading") {
            return "Analysis in progress. Please wait...";
        }
        return "No conclusive result";
    } catch (error) {
        console.error("Error processing API response:", error);
        return "Error processing result";
    }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "checkEmail") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "fetchEmailText"}, function(response) {
                if(response.emailText){
                    query({inputs: response.emailText, options: { isHTML: true }}).then(apiResponse => {
                        let result = processApiResponse(apiResponse);
                        sendResponse({result: result});
                    }).catch(error => {
                        console.error("Error querying the API:", error);
                        sendResponse({result: "Error occurred. Please try again later."});
                    });
                }
            });
        });

        return true; // Keep the message channel open for the async response
    }
});
