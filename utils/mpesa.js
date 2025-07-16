import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getMpesaAccessToken = async () => {
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
  
      return res.data.access_token;
    } catch (error) {
      console.error('Error fetching token:', error.message);
      throw error;
    }
  };
