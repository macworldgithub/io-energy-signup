export async function submitSignup(payload) {
  const api_path =
    import.meta.env.MODE === "production" || import.meta.env.MODE === "staging"
      ? "https://api.gleen.com.au"
      : "http://localhost:8000";

  const url = `${api_path}/ioenergy/signups/`;

  if (Array.isArray(payload)) {
    return {
      success: false,
      error:
        "submitSignup now expects a WebsiteSignupIn payload object, not a list of connections.",
    };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        success: false,
        error: data?.detail || response.statusText || "Request failed",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
}
