// services/brevoService.js
// Thin wrapper around Brevo's transactional email API with local logger fallback.
const axios = require('axios');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendEmail({ to, toName, subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey === 'your_brevo_api_key') {
    console.log('\n============================================================');
    console.log(`[MOCK EMAIL SENT]`);
    console.log(`To: ${toName} <${to}>`);
    console.log(`Subject: ${subject}`);
    console.log(`Sender: Katy Property Solutions <${process.env.BREVO_SENDER_EMAIL}>`);
    console.log('------------------------------------------------------------');
    console.log('HTML Content Preview (First 300 chars):');
    console.log(htmlContent.substring(0, 300) + (htmlContent.length > 300 ? '...' : ''));
    console.log('============================================================\n');
    return { data: { messageId: 'mock-id-' + Math.random().toString(36).substring(2, 9) } };
  }

  return axios.post(
    BREVO_API_URL,
    {
      sender: { name: 'Katy Property Solutions', email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent,
    },
    {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
    }
  );
}

module.exports = { sendEmail };
