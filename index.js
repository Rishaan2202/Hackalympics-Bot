import 'dotenv/config';


const startApp = async() => {

    console.log("Loaded ENV Keys:", {
        SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
        SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
        SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN
    });
    
    const { App } = await import('@slack/bolt');

    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        socketMode: true,
        appToken: process.env.SLACK_APP_TOKEN
    });
    
    app.command('/hackalympics-ping', async ({ command, ack, say }) => {
        const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await say(`Hello, <@${command.user_id}>! Latency: ${latency}ms`);
});

(async () => {
    await app.start();
    console.log('⚡️ Bolt app is running!');
})();
}

startApp().catch((error) => {
    console.error('Error starting the app:', error);
});