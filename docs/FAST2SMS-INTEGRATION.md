# Fast2SMS integration (Quick SMS only – mobile OTP)

LeadFormHub sends mobile OTP via [Fast2SMS](https://www.fast2sms.com) **Quick SMS** only (route `"q"`). No DLT.

## Official documentation

- **API reference:** https://docs.fast2sms.com/reference  
- **Quick SMS:** https://docs.fast2sms.com/reference/get_new-endpoint  

## Endpoint

- **URL:** `https://www.fast2sms.com/dev/bulkV2`  
- **Method:** POST  
- **Headers:** `Content-Type: application/json`, `Authorization: <API_KEY>`  
- **Body:** `{ route: "q", message: "...", numbers: "9876543210", flash: "0" }`

## Env variable

- **`FAST2SMS_QUICK_API_KEY`** – Get this from Fast2SMS dashboard → Quick SMS section.

## If you see a verification error

Complete **website verification** in the Fast2SMS dashboard (Quick SMS section), then try again. We show: *"Complete website verification in Fast2SMS dashboard (Quick SMS section), then try again."*

## Optional debug

Set `FAST2SMS_DEBUG=true` in `.env` to log request and response in the server terminal.

## Code

- **Implementation:** `src/lib/sms.ts` → `sendOtpViaFast2SMS()`  
- **Usage:** `src/services/otp.service.ts` → `createAndSendOtp()`
