const crypto = require('crypto');
const axios = require('axios');

class TelebirrService {
  constructor() {
    this.appId = process.env.TELEBIRR_APP_ID;
    this.appKey = process.env.TELEBIRR_APP_KEY;
    this.publicKey = process.env.TELEBIRR_PUBLIC_KEY;
    this.privateKey = process.env.TELEBIRR_PRIVATE_KEY;
    this.shortCode = process.env.TELEBIRR_SHORT_CODE;
    this.notifyUrl = process.env.TELEBIRR_NOTIFY_URL;
    this.returnUrl = process.env.TELEBIRR_RETURN_URL;
    this.baseUrl = process.env.TELEBIRR_BASE_URL || 'https://openapi.telebirr.com';
    this.sandboxMode = process.env.TELEBIRR_SANDBOX === 'true';
  }

  /**
   * Generate a random nonce for request security
   */
  generateNonce() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Sign the payload using RSA-SHA256
   */
  signPayload(payload) {
    try {
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(JSON.stringify(payload));
      return sign.sign(this.privateKey, 'base64');
    } catch (error) {
      throw new Error(`Failed to sign payload: ${error.message}`);
    }
  }

  /**
   * Verify signature from Telebirr response
   */
  verifySignature(payload, signature) {
    try {
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(JSON.stringify(payload));
      return verify.verify(this.publicKey, signature, 'base64');
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Initiate payment with Telebirr
   */
  async initiatePayment(paymentData) {
    try {
      const {
        outTradeNo,
        totalAmount,
        subject,
        receiveName,
        timeoutExpress = '30'
      } = paymentData;

      const payload = {
        appId: this.appId,
        appKey: this.appKey,
        nonce: this.generateNonce(),
        notifyUrl: this.notifyUrl,
        outTradeNo,
        receiveName: receiveName || 'Rentify Platform',
        returnUrl: this.returnUrl,
        shortCode: this.shortCode,
        subject,
        timeoutExpress,
        totalAmount: totalAmount.toString()
      };

      // Sign the payload
      const signature = this.signPayload(payload);
      payload.sign = signature;

      // Make request to Telebirr
      const response = await axios.post(
        `${this.baseUrl}/payments/initiate`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data && response.data.code === '00000') {
        return {
          success: true,
          paymentUrl: response.data.data?.toPayUrl,
          transactionId: response.data.data?.transactionId,
          qrCode: response.data.data?.qrCode
        };
      } else {
        throw new Error(response.data?.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Telebirr payment initiation error:', error);
      throw new Error(`Payment initiation failed: ${error.message}`);
    }
  }

  /**
   * Query payment status
   */
  async queryPaymentStatus(outTradeNo) {
    try {
      const payload = {
        appId: this.appId,
        appKey: this.appKey,
        nonce: this.generateNonce(),
        outTradeNo
      };

      const signature = this.signPayload(payload);
      payload.sign = signature;

      const response = await axios.post(
        `${this.baseUrl}/payments/query`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data && response.data.code === '00000') {
        return {
          success: true,
          status: response.data.data?.status,
          transactionId: response.data.data?.transactionId,
          amount: response.data.data?.totalAmount,
          paidAt: response.data.data?.paidAt
        };
      } else {
        throw new Error(response.data?.message || 'Payment query failed');
      }
    } catch (error) {
      console.error('Telebirr payment query error:', error);
      throw new Error(`Payment query failed: ${error.message}`);
    }
  }

  /**
   * Process payment notification from Telebirr
   */
  processNotification(notificationData) {
    try {
      const { sign, ...payload } = notificationData;
      
      // Verify signature
      if (!this.verifySignature(payload, sign)) {
        throw new Error('Invalid signature');
      }

      return {
        success: true,
        outTradeNo: payload.outTradeNo,
        status: payload.status,
        transactionId: payload.transactionId,
        totalAmount: payload.totalAmount,
        paidAt: payload.paidAt,
        message: payload.message
      };
    } catch (error) {
      console.error('Telebirr notification processing error:', error);
      throw new Error(`Notification processing failed: ${error.message}`);
    }
  }

  /**
   * Format amount for Telebirr (convert to cents/etb)
   */
  formatAmount(amount) {
    // Telebirr expects amount in ETB (Ethiopian Birr)
    // If your system uses USD, you might need to convert
    return Math.round(amount * 100); // Convert to cents
  }

  /**
   * Validate required configuration
   */
  validateConfig() {
    const required = [
      'appId', 'appKey', 'publicKey', 'privateKey', 
      'shortCode', 'notifyUrl', 'returnUrl'
    ];
    
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing Telebirr configuration: ${missing.join(', ')}`);
    }
    
    return true;
  }
}

module.exports = new TelebirrService();
