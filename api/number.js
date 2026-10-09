export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  const { number, aadhar } = req.query;
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

  try {
    // Array of objects matching your desired response structure
    const resultsArray = [
      {
        name: "Prem Kumar",
        fathersName: "Jwala Prasad",
        phoneNumber: "8800952843",
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: "8923794921",
        address: "!a49 om vihar phase 5!delhi!delhi uttam nagar!DelhiDelhi!Delhi!110059",
        district: null,
        pincode: null,
        state: null,
        town: null,
        source: "inddata"
      },
      {
        name: "Prem Kumar",
        fathersName: "Jwala Prasad",
        phoneNumber: "8368809713",
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: "9953295276",
        address: "! D-29!Om Vihar phase-5!!Uttam nagar!New Delhi West!West!Delhi!110059",
        district: null,
        pincode: null,
        state: null,
        town: null,
        source: "inddata"
      },
      {
        name: "Prem Kumar",
        fathersName: "Jwala Prasad",
        phoneNumber: "9953295276",
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: "8743849396",
        address: "Jwala Prasad!a49!delhi om vihar phase 5!delhi!DELHI!Delhi!110059",
        district: null,
        pincode: null,
        state: null,
        town: null,
        source: "inddata"
      },
      {
        name: "Prem Kumar",
        fathersName: "Jwala Prasad",
        phoneNumber: "8368809713",
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: "9953295276",
        address: "!D-29!Om Vihar phase-5!!Uttam nagar!New Delhi West!West!Delhi!110059",
        district: null,
        pincode: null,
        state: null,
        town: null,
        source: "inddata"
      },
      {
        name: "PremKumar",
        fathersName: "Jwala Prasad",
        phoneNumber: "9953295276",
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: "8743849396",
        address: "Jwala Prasad!a49!delhiom vihar phase 5!delhi!DELHI!Delhi!110059",
        district: null,
        pincode: null,
        state: null,
        town: null,
        source: "inddata"
      },
      {
        name: "Prem Kumar",
        fathersName: "Jwala Prasad",
        phoneNumber: "8800952843",
        aadharNumber: "[Aadhaar Redacted]",
        otherNumber: "8923794921",
        address: "!a49 om vihar phase 5!AIRTEL DELHI!!AIRTEL DELHI uttam nagar!AIRTEL DELHI!!AIRTEL DELHI!110059",
        district: null,
        pincode: null,
        state: null,
        town: null,
        source: "inddata"
      }
    ];

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
      message: "Internal server error",
      developer: "Naresh"
    });
  }
}