export default async function handler(req, res) {
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
      message: "invalid key",
      developer: "Naresh"
    });
  }

  if (!searchInput) {
    return res.status(400).json({
      status: "error",
      message: "number or aadhar parameter required",
      developer: "Naresh"
    });
  }

  try {
    // Dynamic upstream API Call
    const upstream = await fetch(
      `https://numberinfo-api-adibhai.vercel.app/api/number?number=${encodeURIComponent(searchInput)}`
    );
    const apiData = await upstream.json();

    // Upstream nunchi vachina data multiple records or single record ga unte handle cheyadaniki
    let resultsArray = [];

    if (Array.isArray(apiData.result)) {
      resultsArray = apiData.result.map(item => ({
        name: item.name || item.Name || "N/A",
        fathersName: item.fathersName || item.fname || item.father_name || "N/A",
        phoneNumber: item.phoneNumber || item.mobile || searchInput,
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: item.otherNumber || item.alt_number || "N/A",
        address: item.address || item.Address || "N/A",
        district: item.district || null,
        pincode: item.pincode || null,
        state: item.state || null,
        town: item.town || null,
        source: item.source || "inddata"
      }));
    } else if (apiData.data) {
      const raw = apiData.data;
      resultsArray = [{
        name: raw.name || raw.Name || "N/A",
        fathersName: raw.fname || raw.fathersName || raw.father_name || "N/A",
        phoneNumber: raw.phoneNumber || raw.mobile || searchInput,
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: raw.alt_number || raw.otherNumber || "N/A",
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
      message: "upstream fetch failed",
      developer: "Naresh"
    });
  }
}
