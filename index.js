import 'dotenv/config';

const HELP_CHANNEL_ID = 'C0C3YCC3WJV';

const startApp = async () => {

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

    app.message(/.*/, async ({ message, say }) => {

        if (message.subtype && message.subtype === 'bot_message') {
            return;
        }

        if (message.thread_ts) {
            return;
        }

        if (message.channel === HELP_CHANNEL_ID) {

            const targetMsg = message.thread_ts ? message.thread_ts : message.ts;

            await say({
                text: `Heya <@${message.user}>! It's great to see that you came here for seeking help. A member of our team will reach out to you shortly. In the meantime, go make some freaking cool projects!`,
                thread_ts: targetMsg
            });
        }
        
    });

    app.command('/hackalympics-ping', async ({ command, ack, say }) => {
        await ack();
        await say(`Heya, <@${command.user_id}>! Latency: ${latency}ms`);
    });

    (async () => {
        await app.start();
        console.log('⚡️ Bolt app is running!');
    })();
}

startApp().catch((error) => {
    console.error('Error starting the app:', error);
});