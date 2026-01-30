// -----------------------
// Plans API
// -----------------------

const api_path =
  import.meta.env.MODE === "production" || import.meta.env.MODE === "staging"
    ? "https://api.gleen.com.au/plans"
    : "http://127.0.0.1:8000/plans";

async function get(endpoint, options = {}) {
  // return [];
  let url = new URL(`${api_path}/${endpoint}`);
  Object.entries(options).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

export async function getBPIDS(options = {}) {
  return await get("bpids", options);
}

export async function getPlans(options = {}) {
  return await get("flagship", options);
}

// retrieves all available plans for a customer to signup to
export async function getSignupPlans(options = {}) {
  return await get("signup", options);
}

// retrieves specific plan
export async function getSignupPlan(price_plan_code) {
  const data = await get("signup", { price_plan_code });
  return data && data.length > 0 ? data[0] : null;
}

// retrieves the intermediate plans for a connection
export async function getIntermediatePlans(
  current_network_tariff_code,
  current_meter_type,
  price_plan_code,
) {
  // return [];
  const url = new URL(`${api_path}/journey`);
  const args = { price_plan_code };
  if (current_meter_type || current_network_tariff_code)
    args.current_site_details = {
      meter_type: current_meter_type,
      network_tariff_code: current_network_tariff_code,
    };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (response.status === 200) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}
