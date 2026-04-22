const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;
const PI_API_URL = 'https://api.minepi.com/v2';

if (!PI_API_KEY) {
  console.error("FATAL: PI_API_KEY is not set in environment variables.");
}

const headers = {
  'Authorization': `Key ${PI_API_KEY}`,
  'Content-Type': 'application/json'
};

app.get('/', (req, res) => {
  res.send('Charge Union Pi Server is running ✅');
});

app.post('/payments/approve', async (req, res) => {
  const { paymentId } = req.body;
  console.log(`[Approve] Request for paymentId: ${paymentId}`);

  if (!paymentId) {
    return res.status(400).json({ error: "paymentId is required" });
  }

  try {
    const piResponse = await axios.post(`${PI_API_URL}/payments/${paymentId}/approve`, {}, { headers });
    console.log(`[Approve] Success for paymentId: ${paymentId}`);
    return res.status(200).json(piResponse.data);
  } catch (error) {
    const errorData = error.response?.data || { error: error.message };
    console.error('[Approve] Error:', errorData);
    return res.status(error.response?.status || 500).json(errorData);
  }
});

app.post('/payments/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  console.log(`[Complete] Request for paymentId: ${paymentId}, txid: ${txid}`);

  if (!paymentId ||!txid) {
    return res.status(400).json({ error: "paymentId and txid are required" });
  }

  try {
    const piResponse = await axios.post(`${PI_API_URL}/payments/${paymentId}/complete`, { txid }, { headers });
    console.log(`[Complete] Success for paymentId: ${paymentId}`);
    return res.status(200).json(piResponse.data);
  } catch (error) {
    const errorData = error.response?.data || { error: error.message };
    console.error('[Complete] Error:', errorData);
    return res.status(error.response?.status || 500).json(errorData);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
