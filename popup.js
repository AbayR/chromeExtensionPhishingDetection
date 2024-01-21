// popup.js

document.addEventListener('DOMContentLoaded', function() {
    var checkButton = document.getElementById('checkButton');
    checkButton.addEventListener('click', function() {

        // Send a message to the background script
        chrome.runtime.sendMessage({action: "checkEmail"}, function(response) {
            // Handle the response
            var statusDiv = document.getElementById('status');
            if (response.result) {
                statusDiv.textContent = 'Phishing Detected: ' + response.result;
            } else {
                statusDiv.textContent = 'No phishing detected.';
            }
        });

    }, false);
}, false);

