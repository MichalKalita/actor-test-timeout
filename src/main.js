// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/).
import { Actor } from 'apify';

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init().
await Actor.init();

// Structure of input is defined in input_schema.json
const input = await Actor.getInput();
const { timeout } = input;

// Validate timeout input
if (typeof timeout !== 'number' || timeout <= 0) {
    throw new Error('Invalid timeout value. Please provide a positive number.');
}

const startTime = new Date();
const interval = setInterval(async () => {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    
    await Actor.setStatusMessage(`Working ${elapsedTime}s of ${timeout}s`);

    if (elapsedTime >= timeout) {
        clearInterval(interval);
        console.log('Timeout complete');

        // Push data containing timeout, elapsed time, completion status, and clear text
        await Actor.pushData({
            timeout,
            elapsedTime,
            message: `The process ran for ${elapsedTime} seconds and completed successfully.`
        });
        await Actor.exit();
    }
}, 1000);
