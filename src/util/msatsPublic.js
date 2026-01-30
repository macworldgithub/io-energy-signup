// util/msatsPublic.js
const api_path =
  import.meta.env.MODE === "production" || import.meta.env.MODE === "staging"
    ? "https://api.gleen.com.au/accounts"
    : "http://127.0.0.1:8000/accounts";

export async function fetchPublicNmiDetails(nmi) {
  const res = await fetch(
    `${api_path}/public/nmi-details/${encodeURIComponent(nmi)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  let data = {};
  try {
    data = await res.json();
  } catch {}
  if (!res.ok || (data && data.error)) {
    return { error: (data && data.error) || "Failed to fetch NMI details." };
  }
  return data; // { publicId, maskedNmi, address, ... }
}

// payload should mirror your NMIDiscoveryQuery fields the backend expects
export async function discoverPublicNmis(payload) {
  const res = await fetch(`${api_path}/public/nmi-discovery-filtered`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let data = {};
  try {
    data = await res.json();
  } catch {}
  if (!res.ok || (data && data.error)) {
    return { error: (data && data.error) || "Discovery failed." };
  }
  // returns either { exactMatch: {...} } or { matches: [...], matchedOnGASA, message }
  return data;
}

export function isMeterRequired(msats) {
  console.log("msats:", msats);
  if (!msats) return null;
  if (msats.meterTypeCode.startsWith("COMMS")) return false;
  if (msats.meterTypeCode.startsWith("MRIM")) return false;
  return true;
}

export function getConnectionStatus(msats) {
  console.log("msats:", msats);
  const tariffCode = msats?.tariffCode || null;
  const meterTypeCode = msats?.meterTypeCode || null;

  if (!tariffCode || !meterTypeCode) return 0;
  if (!meterTypeCode.startsWith("COMMS")) return 1;
  if (["RELE", "SBTOUE", "RELECL"].includes(tariffCode)) return 3;
  return 2;
}
