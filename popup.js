document.getElementById('start').addEventListener('click', () => {
  const interval = document.getElementById('interval').value;
  const unit = document.getElementById('interval-unit').value;
  const location = document.getElementById('location').value;

  let intervalInMilliseconds;
  if (unit === 'seconds') {
    intervalInMilliseconds = interval * 1000;
  } else if (unit === 'minutes') {
    intervalInMilliseconds = interval * 60 * 1000;
  } else if (unit === 'hours') {
    intervalInMilliseconds = interval * 60 * 60 * 1000;
  }

  chrome.runtime.sendMessage({ action: 'start', interval: intervalInMilliseconds, location: location }, alert("AutoScreenshot started taking screenshot"));
});

document.getElementById('stop').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' }, alert("AutoScreenshot Stopped!!!"));
});
