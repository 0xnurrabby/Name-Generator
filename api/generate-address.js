const MODEL = "google/gemini-2.5-flash-lite";
const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";

function getGatewayToken(){
  return process.env.AI_GATEWAY_API_KEY
    || process.env.VERCEL_AI_GATEWAY_API_KEY
    || process.env.VERCEL_GATEWAY_API_KEY
    || process.env.VERCEL_GATEWAY_TOKEN
    || "";
}

function send(res, status, body){
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res){
  if (req.method !== "POST"){
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed" });
  }

  const token = getGatewayToken();
  if (!token) return send(res, 500, { error: "AI Gateway token is not configured" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const country = String(body.country || "United States").trim();
  const customState = String(body.customState || "").trim();
  const customCity = String(body.customCity || "").trim();
  const customZip = String(body.customZip || "").trim();
  const draft = body.draft && typeof body.draft === "object" ? body.draft : {};

  const prompt = [
    `Country: ${country}`,
    `Draft street: ${String(draft.street || "").trim()}`,
    `Draft city: ${String(draft.city || "").trim()}`,
    `Draft state/province/region: ${String(draft.region || "").trim()}`,
    `Draft ZIP/postal code: ${String(draft.postalCode || "").trim()}`,
    customState ? `State/Province/Region: ${customState}` : "",
    customCity ? `City: ${customCity}` : "",
    customZip ? `ZIP/Postal Code: ${customZip}` : "",
    "Verify and correct the draft fictional address so every location field belongs to the selected country.",
    "Do not use a real person's private information.",
    "If a custom State/City/ZIP is compatible with the selected country, keep it. If it is impossible or mismatched, replace it with a valid matching value.",
    "Example: Dhaka with United States is invalid, so replace city/region/postal code with a valid United States combination.",
    "Postal code must match the selected country's normal format and be plausible for the corrected region/city.",
    "Return only JSON with keys: street, city, region, postalCode, country."
  ].filter(Boolean).join("\n");

  try{
    const gatewayRes = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You verify and correct fictional postal addresses. Return strict JSON only." },
          { role: "user", content: prompt }
        ],
        stream: false,
        temperature: 0.2,
        max_tokens: 350,
        response_format: { type: "json_object" }
      })
    });

    if (!gatewayRes.ok) return send(res, 502, { error: "AI Gateway request failed" });
    const data = await gatewayRes.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return send(res, 502, { error: "AI Gateway returned empty content" });

    const address = JSON.parse(content);
    return send(res, 200, {
      street: String(address.street || "").trim(),
      city: String(address.city || customCity || "").trim(),
      region: String(address.region || customState || "").trim(),
      postalCode: String(address.postalCode || customZip || "").trim(),
      country: String(address.country || country).trim()
    });
  }catch(err){
    return send(res, 502, { error: "Address generation failed" });
  }
};
