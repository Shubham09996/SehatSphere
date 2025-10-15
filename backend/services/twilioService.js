import twilio from 'twilio';
import config from '../config/config.js';

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

const sendSms = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to: to,
    });
    console.log(`SMS sent to ${to}: ${result.sid}`);
    return result;
  } catch (error) {
    console.error(`Error sending SMS to ${to}: ${error.message}`);
    throw error;
  }
};

const makeCall = async (to, twimlUrl) => {
    try {
        const result = await client.calls.create({
            url: twimlUrl,
            to: to,
            from: config.twilio.phoneNumber,
        });
        console.log(`Call initiated to ${to}: ${result.sid}`);
        return result;
    } catch (error) {
        console.error(`Error initiating call to ${to}: ${error.message}`);
        throw error;
    }
};

export { sendSms, makeCall };
