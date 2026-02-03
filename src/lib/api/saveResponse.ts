// Utility function to save RSVP response to the database
export async function saveResponse(slug: string, response: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/invites/${slug}/response`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    });

    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error("Failed to save response:", error);
    return false;
  }
}
