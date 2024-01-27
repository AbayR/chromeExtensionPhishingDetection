// content.js file for fetching the email and passing it to the background.js file
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fetchEmailText") {
        var emailText = getEmailText(); // Function to get email text
        sendResponse({ emailText: emailText }); // Ensure this is correctly structured
        return true;  // Indicate that the response is asynchronous
    }
});

function getEmailText() {
    var openEmailBody = document.querySelector('div.a3s.aiL');
    if (openEmailBody) {
        return openEmailBody.innerHTML; // Changed to innerHTML to get HTML content
    } else {
        return "No email content found";
    }
}


