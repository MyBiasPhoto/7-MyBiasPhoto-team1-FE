export async function postSalePhotoCard(photoCardId, payload) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const postSalePhotoCardUrl = `${baseUrl}/sales/photo-card/${photoCardId}`;

  const res = await fetch(postSalePhotoCardUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const ct = res.headers.get("content-type") || "";
  let body = null;
  try {
    if (ct.includes("application/json")) body = await res.json();
    else body = await res.text();
  } catch (_) {
    body = null;
  }

  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && body.message) ||
      (typeof body === "string" && body) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body ?? { ok: true };
}
