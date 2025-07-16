import axios from 'axios';
import moment from 'moment';
import { getMpesaAccessToken } from '../utils/mpesa.js';
import Payment from '../models/payment.js';
// routes/mpesa.route.js

export const mpesaStkPush = async (req, res) => {
  const { phone, amount } = req.body;
  const number = `254${phone.replace(/^0/, '')}`;

  console.log("Real STK Push triggered");

  try {
    const token = await getMpesaAccessToken();

    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const callbackUrl = `${process.env.MPESA_CALLBACK_URL}/api/mpesa/callback`

    console.log("📡 Callback URL being sent:", callbackUrl);



    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: number,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: number,
        CallBackURL: callbackUrl,
        AccountReference: 'Test123',
        TransactionDesc: 'Payment for goods',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({
      message: 'STK Push Sent',
      data: response.data,
    });
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send STK Push' });
  }
};


export const handleMpesaCallback = async (req, res) => {
    try {
      console.log('M-Pesa Callback received:');
      console.log(JSON.stringify(req.body, null, 2));
  
      const { Body } = req.body;
      const stkCallback = Body?.stkCallback;
  
      if (stkCallback?.ResultCode === 0) {
        const metadata = stkCallback.CallbackMetadata?.Item || [];
        const data = {};
  
        metadata.forEach(item => {
          data[item.Name] = item.Value;
        });
  
        console.log('✅ Payment Successful:', data);
  
        const newPayment = new Payment({
          amount: data.Amount,
          receipt: data.MpesaReceiptNumber,
          phone: data.PhoneNumber,
          reference: stkCallback.CheckoutRequestID,
        });
  
        await newPayment.save(); // ✅ Save to MongoDB
      } else {
        console.log('❌ Payment Failed or Cancelled:', stkCallback?.ResultDesc);
  
        await Payment.create({
          amount: 0,
          receipt: 'N/A',
          phone: 'N/A',
          reference: stkCallback.CheckoutRequestID,
          status: 'Failed',
        });
      }
  
      res.status(200).json({ message: 'Callback received successfully' });
    } catch (err) {
      console.error('Callback error:', err.message);
      res.status(500).json({ message: 'Error handling callback' });
    }
  };
  

export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json(payments);
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch payments' });
      }
  }
  
  

  

