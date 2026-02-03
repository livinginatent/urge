"use server";

import { Resend } from "resend";
import { ContactFormSchema, type ContactFormState } from "@/lib/definitions";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(
  state: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Validate form fields
  const validatedFields = ContactFormSchema.safeParse({
    reason: formData.get("reason"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  // Return early if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { reason, email, message } = validatedFields.data;

  // Map reason to readable label
  const reasonLabels: Record<string, string> = {
    support: "Support / Something is broken",
    billing: "Billing / Subscription",
    feedback: "Feedback / Idea",
    other: "Other",
  };

  const reasonLabel = reasonLabels[reason] || reason;

  // Escape HTML to prevent XSS
  const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  // Escape and format message (preserve line breaks)
  const escapedMessage = escapeHtml(message).replace(/\n/g, "<br>");
  const escapedEmail = escapeHtml(email);
  const escapedReasonLabel = escapeHtml(reasonLabel);

  try {
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "URGE Contact Form <contact@urges.app>",
      to: ["contact@urges.app"],
      replyTo: email,
      subject: `Contact Form: ${reasonLabel}`,
      html: `
        <div style="font-family: monospace; color: #a1a1aa; background: #050505; padding: 20px;">
          <h2 style="color: #ffffff; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="margin-bottom: 16px;">
            <strong style="color: #ffffff;">Reason:</strong>
            <span style="margin-left: 8px;">${escapedReasonLabel}</span>
          </div>
          <div style="margin-bottom: 16px;">
            <strong style="color: #ffffff;">From:</strong>
            <span style="margin-left: 8px;">${escapedEmail}</span>
          </div>
          <div style="margin-bottom: 16px;">
            <strong style="color: #ffffff;">Message:</strong>
            <div style="margin-top: 8px; padding: 12px; background: #0a0a0a; border: 2px solid #27272a; white-space: pre-wrap;">${escapedMessage}</div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Reason: ${reasonLabel}
From: ${email}

Message:
${message}
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        message: "Failed to send message. Please try again later.",
      };
    }

    return {
      success: true,
      message: "Message sent successfully. We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
