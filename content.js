// content.js file for fetching the email and passing it to the background.js file
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fetchEmailText") {
        var emailText = getEmailText(); // Function to get email text
        sendResponse({ emailText: emailText }); // Ensure this is correctly structured
        return true;  // Indicate that the response is asynchronous
    }
});

function getEmailText() {
    // Updated selector to target the div with class 'a3s aiL'
    var openEmailBody = document.querySelector('div.a3s.aiL');
    if (openEmailBody) {
        return openEmailBody.innerText;
    } else {
        // Fallback message or handling if the email body is not found
        return "No email content found";
    }
}




/*
function getCurrentEmailText() {
    // Adjust the selector as needed to accurately target the open email content
    var openEmailBody = document.querySelector('div[data-message-id].zA[tabindex="0"] div[role="listitem"]');

    if (openEmailBody) {
        // Send the email text to the background script
        chrome.runtime.sendMessage({emailText: openEmailBody.innerText}, function(response) {
            console.log("Response from background:", response);
        });
    }
}

// Consider calling this function based on a specific event, such as a button click in the popup
document.addEventListener('someTriggerEvent', getCurrentEmailText);

*/