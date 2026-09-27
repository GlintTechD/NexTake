export async function subscribeToNewsletter(
  email: string,
  frequency = 'daily',
): Promise<void> {
  const response = await fetch('/api/public/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), frequency }),
  });

  if (!response.ok) {
    throw new Error('Unable to save subscription.');
  }
}