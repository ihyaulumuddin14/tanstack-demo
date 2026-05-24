export async function initNotifications(): Promise<{ initialized: boolean }> {
  const response = await fetch("/api/notifications/init", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to initialize notifications");
  }

  return response.json();
}
