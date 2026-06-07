import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, productTitle, productHandle } =
      await req.json();

    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Name, email, and company are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL;
    const toEmail = process.env.NEXT_PUBLIC_SENDGRID_TO_EMAIL;

    if (!apiKey || !fromEmail || !toEmail) {
      console.error('[send-message] Missing SendGrid env vars');
      return NextResponse.json(
        { error: 'Server email configuration is missing.' },
        { status: 500 }
      );
    }

    const htmlContent = `
      <h2>Enterprise Product Enquiry</h2>
      <p><strong>Product:</strong> ${productTitle || 'N/A'} ${productHandle ? `(<a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/shop/products/${productHandle}">${productHandle}</a>)` : ''}</p>
      <hr />
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
    `;

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: toEmail }],
            subject: `Enterprise Enquiry from ${name}`,
          },
        ],
        from: { email: fromEmail },
        reply_to: { email, name },
        content: [{ type: 'text/html', value: htmlContent }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[send-message] SendGrid error:', errText);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[send-message] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
