import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Using the explicit key provided by the user
const resend = new Resend('re_Kk66jn2p_H4wSM43sqmKoLssFzynAsuRh');

export async function POST(request: Request) {
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
      from: 'Vache Simonyan <versus.proc@gmail.com>',
      to: ['versus.proc@gmail.com'],
      replyTo: email,
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
