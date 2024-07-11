let intervalId;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        const interval = message.interval;
        const location = message.location;
        // Clear any existing intervals before starting a new one
        if (intervalId) {
            clearInterval(intervalId);
        }

        intervalId = setInterval(() => {
            console.log(`Taking screenshot every ${interval} milliseconds and saving to folder ${location}`);

            // Query the active tab and ensure it's ready for capture
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                console.log('Tabs queried:', tabs);
                // try {
                //     console.log('Tabs queried:', tabs);
                // } catch (err) {
                //     console.log(message.err);
                // }

                let activeTab = tabs[0];

                if (!activeTab) {
                    console.error('No active tab found.');
                    return;
                }

                // Capture the visible tab
                chrome.tabs.captureVisibleTab(activeTab.windowId, { format: 'png' }, (image) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error capturing tab:', chrome.runtime.lastError.message);
                        return;
                    }

                    if (!image) {
                        console.error('Failed to capture image.');
                        return;
                    }

                    // const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
                    // const randomString = Math.random().toString(36).substring(2, 15);
                    // const filename = `${location.replace(/\\/g, '/')}/${timestamp}.${randomString}.png`;
                    // const screenshotDir ="C:\\Users\\ASUS\\Downloads\\Downloads\\ScShot\\";
                    // let filename = new Date().toISOString().replace(/[:.]/g, "") + ".png";
                    // let filePath = screenshotDir + filename;

                    const filename = `${location}\\screenshot_${Date.now()}.png`;

                    // console.log('Captured image data:', image);
                    // console.log('Saving screenshot as:', filename);

                    chrome.downloads.download({
                        url: image,
                        filename: filename,
                        conflictAction: 'uniquify'
                    }, (downloadId) => {
                        if (chrome.runtime.lastError) {
                            console.error('Error downloading file:', chrome.runtime.lastError.message);
                        } else {
                            console.log('Screenshot saved with download ID:', downloadId);
                        }
                    });
                });
            });
        }, interval);
        console.log('Screenshot interval started');
    }
    if (message.action === 'stop') {
        clearInterval(intervalId);
        intervalId = null;
        console.log('Screenshot interval stopped');
    }
});
