// Function to send analytics data to the backend
function sendAnalyticsData(data) {
    fetch('http://127.0.0.1:8000/api/track-event', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
    },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
    .then(data => {
        console.log('Analytics data sent successfully:', data);
    })
    .catch((error) => {
        console.error('Error sending analytics data:', error);
    });
}

// Function to get user's current geolocation
function getCurrentGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const geolocation = `${latitude},${longitude}`;
            // Send geolocation data to backend
            sendAnalyticsData({ geolocation });
        }, error => {
            console.error('Error getting geolocation:', error.message);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Function to get user's IP address
async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        // Send IP address data to backend
        sendAnalyticsData({ ip });
    } catch (error) {
        console.error('Error getting IP address:', error);
    }
}

// Function to capture device information
function captureDeviceInformation() {
    const plugins = Array.from(navigator.plugins).map(plugin => ({
        name: plugin.name,
        description: plugin.description,
        mimeTypes: Array.from(plugin).map(mimeType => mimeType.type),
    }));

    const deviceInformation = {
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        browserLanguage: navigator.language,
        timezone: new Date().getTimezoneOffset(),
        platform: navigator.platform,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        plugins: plugins
    };

    // Send device information to backend
    sendAnalyticsData({ deviceInformation });
}

// Function to capture user activity (e.g., clicks, page views)
function captureUserActivity() {
    document.addEventListener('click', event => {
        const activity = `Clicked on ${event.target.tagName}`;
        // Send activity data to backend
        sendAnalyticsData({ activity });
    });

    // Add more event listeners for other user activities as needed
}

// Main function to capture various real-world data
function captureAnalyticsData() {
    getCurrentGeolocation();
    getIPAddress();
    captureDeviceInformation();
    captureUserActivity();
}

// Capture analytics data when the page loads
captureAnalyticsData();
