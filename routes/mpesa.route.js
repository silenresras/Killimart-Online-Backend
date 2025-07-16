import express from 'express';
import { handleMpesaCallback, mpesaStkPush, getPayments } from '../controllers/mpesa.controller.js';

const router = express.Router();

router.post('/stkpush', mpesaStkPush);
router.post('/callback', handleMpesaCallback);
router.get('/payments', getPayments)
  

export default router;
