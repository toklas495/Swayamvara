import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_FROM_NUMBER!;

const client = twilio(accountSid, authToken);

export async function sendOtpSMS(phone: string, otp: string): Promise<void> {
  const message = `Your OTP code is: ${otp}`;
  await client.messages.create({
    body: message,
    from: fromNumber,
    to: phone.startsWith('+') ? phone : `+91${phone}`
  });
}
