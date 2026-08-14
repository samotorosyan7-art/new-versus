import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Versus Law Firm <onboarding@resend.dev>';
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'versus.proc@gmail.com';

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ success: false, error: 'Email service is not configured' }, { status: 500 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await request.json();
    const { category, name, email, phone, description, type } = data;

    let subject = 'New Inquiry from Versus Platform';
    let htmlContent = '';

    if (type === 'newsletter') {
      subject = 'New Newsletter Subscription';
      htmlContent = `<p><strong>Email:</strong> ${email}</p>`;
    } else {
      subject = `New Matter Inquiry: ${category || 'General'}`;
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #c7a38b;">New Inquiry Received</h2>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Name:</strong> ${name || 'Not provided'}</p>
          <p><strong>Email:</strong> ${email || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Situation Description:</strong></p>
          <blockquote style="border-left: 4px solid #c7a38b; padding-left: 10px; color: #555;">
            ${description || 'Not provided'}
          </blockquote>
        </div>
      `;
    }

    const resendData = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email || undefined,
      subject,
      html: htmlContent,
    });

    if (resendData.error) {
      return NextResponse.json({ success: false, error: resendData.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: resendData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
