export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Placeholder for sending emails.
 * In the future, this can be integrated with Resend, SendGrid, NodeMailer, etc.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  console.log('--- MOCK EMAIL SENDER ---');
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Body: ${options.html}`);
  console.log('-------------------------');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
}
