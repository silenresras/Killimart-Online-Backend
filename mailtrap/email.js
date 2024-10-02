import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from './emailTemplates.js'
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Verification Email",
        })

        console.log("Verification email sent successfully", response)
    } catch (error) {
        console.error("Error sending verification email", error)
        throw new Error("Error sending verification email", error)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "1cf7e4b0-2246-4b5b-8a4c-d74d3da5571c",
            template_variables: {
                "company_info_name": "Auth Company",
                "name": name,
            }

        })

        console.log("Welcome email sent successfully", response)
    } catch (error) {
        console.log("Error sending email", error)
    }
}

export const sendResetPasswordEmail = async (email, resetURL) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Reset Password",
        })
    } catch (error) {
        throw new Error("Couldn't reset password")
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset Password succes",
        })
    } catch (error) {
        throw new Error("Couldn't send reset success email")
    }
}