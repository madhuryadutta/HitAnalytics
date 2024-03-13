// analytics.js

const API_URL = 'https://ominous-barnacle-6xvjpj964xxcr6p9-8000.app.github.dev/api/track-event';
// Update with your backend URL

function generateVisitorId() {
    return localStorage.getItem('visitorId') || Math.random().toString(36).substring(2);
}

function getDeviceInformation() {
    return {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        orientation: screen.orientation ? screen.orientation.type : null,
        timeOffset: new Date().getTimezoneOffset(),
        onlineStatus: navigator.onLine ? "Online" : "Offline",
        memory: navigator.deviceMemory || "Unknown",
        cpuCores: navigator.hardwareConcurrency || "Unknown",
    };
}

function trackEvent(eventType, eventData) {
    const visitorId = generateVisitorId();
    const timestamp = new Date().toISOString();
    const combinedData = {
        ...eventData,
        ...getDeviceInformation(),
    };

    const data = {
        visitor_id: visitorId,
        event_type: eventType,
        event_data: combinedData,
        timestamp: timestamp
    };

    sendEventToServer(data);
}

function sendEventToServer(data) {
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log('Event tracked successfully:', data))
        .catch(error => console.error('Error tracking event:', error));
}

// Real User Monitoring (RUM) example - Track page load time
function trackPageLoadTime() {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    trackEvent('page_load_time', { loadTime });
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    trackPageLoadTime();
    trackEvent('page_view', { url: window.location.pathname });

    document.getElementById('trackButton').addEventListener('click', () => {
        trackEvent('button_click', {
            buttonId: 'trackButton',
            interactionType: 'click',
        });
    });

    document.getElementById('trackForm').addEventListener('submit', (e) => {
        e.preventDefault();
        trackEvent('form_submission', {
            formId: 'trackForm',
            interactionType: 'submit',
        });
    });
});
