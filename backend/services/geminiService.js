import config from "../config/config.js";

// Prefer direct REST as per your working example
const PRIMARY_MODELS = [
  'models/gemini-2.5-flash',
  'models/gemini-1.5-flash-latest',
  'models/gemini-1.0-pro-latest',
  'models/gemini-pro',
];

const getChatbotResponse = async (prompt, userName, language) => {
  const apiKey = config.googleGemini.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) return "I'm having trouble connecting to the assistant right now. Please try again later.";

  // Quick local intents: date/time without hitting external API
  try {
    const q = String(prompt || '').toLowerCase();
    if (/(current|what's|whats|tell|kya|abhi).*(time|samay|waqt)/.test(q) || /(time|samay|waqt)\??$/.test(q)) {
      const now = new Date();
      const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      return `Abhi ka time ${time} hai • ${date}`;
    }
    if (/(current|aaj|today|date|tarikh)/.test(q) && /(date|tarikh|din|day)/.test(q)) {
      const now = new Date();
      const date = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      return `Aaj ki date: ${date}`;
    }
  } catch (_) {}

  const patientName = userName || process.env.DEFAULT_PATIENT_NAME || '';
  const preferHindi = (language || '').toLowerCase() === 'hi';
  const tone = preferHindi
    ? `Tum HealthSphere ke liye ek bahut hi friendly aur madadgar patient assistant ho. Patient se hamesha unke naam (${patientName || 'user'}) se baat karo, unhe apnaपन महसूस कराओ. Baaten hamesha halki, pyari aur sanukool rakho. Tumhara kaam HealthSphere ke features jaise appointments book karna, medicines dhundhna, health records dekhna, bill check karna aur donation options ke baare mein guide karna hai. Kabhi bhi medical diagnosis mat do; agar zarurat ho toh patient ko doctor se consult karne ki salah do.`
    : `You are a very friendly and helpful patient assistant for HealthSphere. Always address the patient by their name (${patientName || 'user'}) to make them feel comfortable and welcomed. Keep your responses warm, concise, and helpful. Your role is to guide patients on HealthSphere's features such as booking appointments, finding medicines, viewing health records, checking billing, and understanding donation options. Never provide medical diagnoses; if necessary, advise the patient to consult a doctor.`;

  const body = {
    contents: [
      { role: 'user', parts: [{ text: tone + "\nUser: " + String(prompt || '') }] },
    ],
  };

  // Try candidate models on v1beta (as per your snippet), then v1
  for (const name of PRIMARY_MODELS) {
    for (const version of ['v1beta', 'v1']) {
      try {
        const url = `https://generativelanguage.googleapis.com/${version}/${name}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.();
        if (text) return text;
        if (data?.error) {
          // Continue to next model/version if 404/unsupported
          if (String(data.error.message||'').includes('not found') || data.error.code === 404) continue;
        }
      } catch (err) {
        // try next
        continue;
      }
    }
  }

  return "Sorry, I couldn't process that right now. Please try again later.";
};

export { getChatbotResponse };
