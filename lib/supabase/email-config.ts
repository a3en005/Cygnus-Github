import { siteConfig } from "@/lib/config"

// Email configuration helper
export const emailConfig = {
  templates: {
    confirmation: {
      subject: "Welcome to Cygnus Search Portal! Confirm Your Account",
      redirectTo: `${siteConfig.url}/auth/callback`,
    },
    recovery: {
      subject: "Reset Your Cygnus Search Portal Password",
      redirectTo: `${siteConfig.url}/auth/reset-password`,
    },
    invite: {
      subject: "You've been invited to Cygnus Search Portal",
      redirectTo: `${siteConfig.url}/auth/signup`,
    },
    magicLink: {
      subject: "Your Cygnus Search Portal Login Link",
      redirectTo: `${siteConfig.url}/dashboard`,
    },
    emailChange: {
      subject: "Confirm Your New Email Address",
      redirectTo: `${siteConfig.url}/profile`,
    },
  },

  // Rate limit information
  rateLimits: {
    defaultEmailsPerHour: 2, // Supabase default
    customSMTPUnlimited: true, // With custom SMTP
    otpPerHour: 30, // OTP rate limit
    windowBetweenRequests: 60, // seconds
  },

  // Helper function to get user's first name
  getUserFirstName: (userData: any) => {
    const fullName = userData?.full_name || userData?.name || ""
    return fullName.split(" ")[0] || "there"
  },

  // Get the base URL for email templates
  getBaseUrl: () => siteConfig.url,

  // Get email sender information
  getSenderInfo: () => ({
    from: `Cygnus Search Portal <noreply@cygnusportal.vercel.app>`,
    replyTo: `support@cygnusportal.vercel.app`,
  }),
}

// Email rate limit checker
export function checkEmailRateLimit(lastEmailSent?: Date): { canSend: boolean; waitTime?: number } {
  if (!lastEmailSent) {
    return { canSend: true }
  }

  const now = new Date()
  const timeDiff = now.getTime() - lastEmailSent.getTime()
  const hoursSinceLastEmail = timeDiff / (1000 * 60 * 60)

  if (hoursSinceLastEmail >= 1) {
    return { canSend: true }
  }

  const waitTime = Math.ceil((1 - hoursSinceLastEmail) * 60) // minutes to wait
  return { canSend: false, waitTime }
}
