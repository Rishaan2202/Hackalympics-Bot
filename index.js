import 'dotenv/config';

const HELP_CHANNEL_ID = 'C0C3YCC3WJV';

const startApp = async () => {

    const { App } = await import('@slack/bolt');
    const { OpenAI } = await import('openai');

    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        socketMode: true,
        appToken: process.env.SLACK_APP_TOKEN
    });

    const client = new OpenAI({
        apiKey: process.env.AI_API_KEY,
        baseURL: "https://ai.hackclub.com/proxy/v1"
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

            console.log(`Received message from user ${message.user} in channel ${message.channel}: ${message.text}`);

            const response = await client.chat.completions.create({
                model: 'openai/gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: message.text
                    },
                ],
                stream: false
            })

            await say({
                text: `Heya <@${message.user}>! ${response.choices[0].message.content}`,
                thread_ts: targetMsg
            });
        }

    });

    app.command('/hackalympics-ping', async ({ command, ack, say }) => {
        const start = Date.now();
        await ack();
        const latency = Date.now() - start;
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