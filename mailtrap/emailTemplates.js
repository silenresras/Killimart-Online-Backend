export const VERIFICATION_EMAIL_TEMPLATE = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
    <h2 style="color: #10b981;">Verify Your Email</h2>
    <p>Hi <strong>{userName}</strong>,</p>

    <p>Thank you for signing up! Your verification code is:</p>

    <div style="
  font-size: 24px;
  font-weight: bold;
  background-color: #f0fdf4;
  padding: 12px 16px;
  border: 1px dashed #10b981;
  border-radius: 6px;
  color: #065f46;
  text-align: center;
  width: fit-content;
  margin: 16px auto;
">
  {verificationCode}
</div>

    <p>Enter this code on the verification page to complete your registration. This code will expire in 15 minutes for security reasons.</p>

    <p>If you didn't create an account with us, please ignore this email.</p>

    <p style="margin-top: 32px;">Best regards,<br/>The Killimart Team</p>
  </div>
`;



export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background-color: #10b981; color: white; padding: 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 22px;">Password Reset Successful</h1>
    </div>

    <!-- Content -->
    <div style="padding: 24px; color: #333; font-size: 16px; line-height: 1.6;">
      <p>Hello,</p>
      <p>We're writing to confirm that your password has been successfully reset.</p>

      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #10b981; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; font-size: 32px; display: inline-block;">
          ✓
        </div>
      </div>

      <p>If you did not initiate this password reset, please contact our support team immediately.</p>

      <p>For added security, we recommend that you:</p>
      <ul style="padding-left: 20px; margin-top: 12px;">
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication (if available)</li>
        <li>Avoid reusing passwords across multiple sites</li>
      </ul>

      <p>Thank you for helping us keep your account secure.</p>

      <p style="margin-top: 32px;">Best regards,<br/><strong>The Killimart Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 16px; background-color: #f0f0f0; color: #888; font-size: 12px;">
      This is an automated message. Please do not reply to this email.
    </div>
  </div>
</body>
</html>
`;


export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background-color: #10b981; color: white; padding: 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 22px;">Reset Your Password</h1>
    </div>

    <!-- Body -->
    <div style="padding: 24px; color: #333; font-size: 16px; line-height: 1.6;">
      <p>Hello,</p>
      <p>We received a request to reset your Killimart account password.</p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>Otherwise, click the button below to reset your password:</p>

      <!-- Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="{resetURL}" style="
          background-color: #10b981;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
          display: inline-block;
        ">
          Reset Password
        </a>
      </div>

      <p>This link will expire in <strong>1 hour</strong> for security reasons.</p>

      <p style="margin-top: 32px;">Best regards,<br/><strong>The Killimart Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 16px; background-color: #f0f0f0; color: #888; font-size: 12px;">
      This is an automated message. Please do not reply to this email.
    </div>
  </div>
</body>
</html>
`;
