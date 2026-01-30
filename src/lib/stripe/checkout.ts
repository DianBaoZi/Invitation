// Client-side checkout helper

export async function createCheckoutSession({
  inviteSlug,
  templateId,
  templateName,
}: {
  inviteSlug: string;
  templateId: string;
  templateName?: string;
}) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inviteSlug,
      templateId,
      templateName,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to create checkout session");
  }

  // Redirect to Stripe checkout
  if (data.url) {
    window.location.href = data.url;
  }

  return data;
}
