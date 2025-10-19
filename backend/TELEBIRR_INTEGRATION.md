# Telebirr Integration Configuration Guide

## Environment Variables Required

Add the following variables to your `.env` file:

```bash
# Telebirr API Configuration
TELEBIRR_APP_ID=your_app_id_here
TELEBIRR_APP_KEY=your_app_key_here
TELEBIRR_PUBLIC_KEY=your_public_key_here
TELEBIRR_PRIVATE_KEY=your_private_key_here
TELEBIRR_SHORT_CODE=your_short_code_here

# Telebirr URLs
TELEBIRR_BASE_URL=https://openapi.telebirr.com
TELEBIRR_NOTIFY_URL=https://yourdomain.com/api/payments/telebirr/webhook
TELEBIRR_RETURN_URL=https://yourdomain.com/api/payments/telebirr/return

# Environment Settings
TELEBIRR_SANDBOX=true
FRONTEND_URL=http://localhost:3000
```

## How to Get Telebirr Credentials

1. **Register for Telebirr Merchant Account**
   - Visit Ethio Telecom's Telebirr merchant portal
   - Complete the registration process
   - Provide required business documentation

2. **Obtain API Credentials**
   - After approval, you'll receive:
     - App ID
     - App Key
     - Public Key (for signature verification)
     - Private Key (for signing requests)
     - Short Code
     - Merchant ID

3. **Configure Webhook URLs**
   - Set up your webhook endpoint: `https://yourdomain.com/api/payments/telebirr/webhook`
   - Set up return URL: `https://yourdomain.com/api/payments/telebirr/return`

## API Endpoints Added

### Payment Initiation
```
POST /api/payments/telebirr/initiate
Body: { "bookingId": "booking_id" }
```

### Payment Status Query
```
GET /api/payments/telebirr/status/:bookingId
```

### Payment Webhook (Telebirr calls this)
```
POST /api/payments/telebirr/webhook
```

### Payment Return (User redirected here)
```
GET /api/payments/telebirr/return?outTradeNo=xxx&status=SUCCESS
```

### Refund Payment
```
POST /api/payments/telebirr/refund
Body: { "bookingId": "booking_id", "reason": "refund_reason" }
```

## Testing

1. **Sandbox Mode**: Set `TELEBIRR_SANDBOX=true` for testing
2. **Test Transactions**: Use Telebirr's test environment
3. **Webhook Testing**: Use ngrok or similar to test webhooks locally

## Security Notes

- Keep all private keys secure
- Use HTTPS for all webhook URLs
- Validate all webhook signatures
- Implement proper error handling
- Log all payment transactions

## Integration Flow

1. User initiates payment → `POST /api/payments/telebirr/initiate`
2. Backend creates payment request with Telebirr
3. User redirected to Telebirr payment page
4. User completes payment on Telebirr
5. Telebirr sends webhook → `POST /api/payments/telebirr/webhook`
6. User redirected back → `GET /api/payments/telebirr/return`
7. Backend updates booking status

## Error Handling

The integration includes comprehensive error handling for:
- Invalid credentials
- Network timeouts
- Signature verification failures
- Payment failures
- Webhook processing errors
