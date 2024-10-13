// Agora App ID 
const APP_ID = 'ee2ea0d745954b6a95a38fbe1ff612d1';

// Create Agora client
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

// Local and remote tracks
let localTracks = [];
let remoteUser = {};

// Join the call
async function joinCall() {
    try {
        const uid = await client.join(APP_ID, 'test-channel', null, null);
        
        // Create local tracks for audio and video
        localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

        // Play local video in the local-player div
        localTracks[1].play('local-player');

        // Publish local tracks to the Agora server
        await client.publish(localTracks);

        console.log("Successfully joined the call with UID:", uid);

        // Activate eMBB slice when joining the call
        const response = await fetch('/api/embb/activate');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error joining call:", error);
    }
}

// Leave the call
async function leaveCall() {
    // Deactivate eMBB slice when leaving the call
    const response = await fetch('/api/embb/deactivate');
    const data = await response.json();
    console.log(data);

    for (let track of localTracks) {
        track.stop();
        track.close();
    }

    await client.leave();
    console.log("Left the call");
}

// Event listener for remote users joining
client.on('user-published', async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    
    if (mediaType === 'video') {
        const remotePlayerContainer = document.getElementById('remote-player');
        user.videoTrack.play(remotePlayerContainer);
    }
});

