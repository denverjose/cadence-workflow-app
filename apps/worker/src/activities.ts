export async function sendEmail(input: {
  to: string;
  subject: string;
  body: string;
}) {
  console.log('Mock Email:', input);

  return {
    success: true,
    messageId: crypto.randomUUID(),
    timestamp: Date.now(),
  };
}
