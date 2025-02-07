document.addEventListener("DOMContentLoaded", function () {
       const isoUrl = "https://5454.cachefly.net/089c7b7d-b5f8-43df-a0c2-9556fa2fc34c.mp4";
// add a url without cors issue -- allow all 
    try {
        const response = await fetch(isoUrl, {
            method: "GET",
            headers: {
                "Accept": "*/*"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reader = response.body.getReader();
        let receivedLength = 0;
        let chunks = [];

        // Read the stream in chunks
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            console.log(`Received ${receivedLength} bytes so far`);
        }

        console.log("ISO file fetched successfully but not saved");
    } catch (error) {
        console.error("Error fetching the ISO file:", error);
    }
    const DEBUG = typeof window.DEBUG !== 'undefined' ? window.DEBUG : false;

    if (DEBUG) {
        console.log(publicKey);
    }

    const storageKey = 'userVisitToken';
    const secretCode = publicKey; // Define the secret code here
    const storedData = localStorage.getItem(storageKey);
    const currentTime = new Date();
    let userID; // Declare userID outside of the if block

    if (storedData) {
        const parsedData = JSON.parse(storedData);
        const lastVisitTime = new Date(parsedData.timestamp);
        userID = parsedData.userID;

        if ((currentTime - lastVisitTime) / (1000 * 60 * 60) < 24) {
            if (DEBUG) {
                console.log('Visit already tracked within the last 24 hours.');
            }
            return;
        }
    } else {
        userID = 'user-' + Math.random().toString(36).substr(2, 9);
    }

    const visitDate = currentTime.toISOString().slice(0, 10);

    const visitData = {
        user_id: userID,
        visit_date: visitDate,
        secret_code: secretCode // Send the secret code to the server
    };

    localStorage.setItem(storageKey, JSON.stringify({ userID: userID, timestamp: currentTime }));

    // fetch('http://localhost:8000/track-visit/', {
    fetch('https://hitanalytics.databytedigital.com/track-visit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (DEBUG) {
                console.log('Success:', data)
            }
        }).catch((error) => {
            if (DEBUG) {
                console.error('Error:', error);
            }
        });
});
