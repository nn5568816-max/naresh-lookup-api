export default async function handler(req, res) {
  // CORS Preflight Headers
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  const { number, aadhar } = req.query;
  const searchInput = aadhar || number;
  const key = req.query.key || null;

  if (!key) {
    return res.status(401).json({
      status: "error",
      message: "key required",
      developer: "Naresh"
    });
  }

  if (!key.startsWith('MYKEY-')) {
    return res.status(401).json({
      status: "error",
      message: "invalid key. Key must start with MYKEY-",
      developer: "Naresh"
    });
  }

  if (!searchInput) {
    return res.status(400).json({
      status: "error",
      message: "12-digit aadhar or phone number parameter required",
      developer: "Naresh"
    });
  }

  try {
    // Upstream API Link Call
    const upstreamUrl = `https://numberinfo-api-adibhai.vercel.app/api/number?number=${encodeURIComponent(searchInput)}`;
    const response = await fetch(upstreamUrl);
    const upstreamData = await response.json();

    let resultsArray = [];

    // Upstream API Data Parsing and Normalization
    if (Array.isArray(upstreamData.result)) {
      resultsArray = upstreamData.result.map(item => ({
        name: item.name || item.Name || "N/A",
        fathersName: item.fathersName || item.fname || item.father_name || "N/A",
        phoneNumber: item.phoneNumber || item.mobile || item.number || searchInput,
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: item.otherNumber || item.alt_number || item.altnum || "N/A",
        address: item.address || item.Address || "N/A",
        district: item.district || null,
        pincode: item.pincode || null,
        state: item.state || null,
        town: item.town || null,
        source: item.source || "inddata"
      }));
    } else if (upstreamData.data) {
      const raw = upstreamData.data;
      resultsArray = [{
        name: raw.name || raw.Name || "N/A",
        fathersName: raw.fname || raw.fathersName || raw.father_name || "N/A",
        phoneNumber: raw.phoneNumber || raw.mobile || raw.number || searchInput,
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: raw.alt_number || raw.otherNumber || raw.altnum || "N/A",
        address: raw.Address || raw.address || "N/A",
        district: raw.district || null,
        pincode: raw.pincode || null,
        state: raw.state || null,
        town: raw.town || null,
        source: "inddata"
      }];
    } else {
      resultsArray = [];
    }

    // Desired JSON Output Structure
    return res.status(200).json({
      result: resultsArray,
      key_details: {
        daily_limit: 1000,
        used_today: 137,
        remaining: 863,
        expiry_date: "2026-10-15",
        status: "Active"
      },
      developer: "Naresh"
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch data from upstream API",
      developer: "Naresh"
    });
  }
}
