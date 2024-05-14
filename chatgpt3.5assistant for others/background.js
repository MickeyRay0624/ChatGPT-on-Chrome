chrome.runtime.onInstalled.addListener(() => {
  console.log("ChatGPT 3.5 Assistant installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'chatgpt_request') {
    console.log('Received request:', request);

    const makeApiCall = (retryCount = 0) => {
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: request.message }],
          max_tokens: 1500
        })
      })
      .then(response => {
        if (!response.ok) {
          if (response.status === 429 && retryCount < 3) {
            console.log(`429 error received. Retrying... (${retryCount + 1}/3)`);
            setTimeout(() => makeApiCall(retryCount + 1), 2000); // Wait 2 seconds before retrying
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API response:', data);
        sendResponse({ reply: data.choices[0].message.content });
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({ reply: `Error: ${error.message}` });
      });
    };

    makeApiCall();
    return true; // Will respond asynchronously.
  }
});
