document.getElementById('send').addEventListener('click', () => {
  const input = document.getElementById('input').value;
  const responseDiv = document.getElementById('response');
  responseDiv.textContent = 'Loading...';

  chrome.runtime.sendMessage({ type: 'chatgpt_request', message: input }, (response) => {
    responseDiv.textContent = response.reply;
  });
});
