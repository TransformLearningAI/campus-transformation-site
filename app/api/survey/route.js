import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request) {
  try {
    const { site, rating, audience, features, comment } = await request.json()

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Campus Transformation <noreply@transformlearning.ai>',
      to: 'jeff@transformlearning.ai',
      subject: `CAMPUS INQUIRY — ${site}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px;">
          <h2 style="color: #00A8A8; margin-bottom: 4px;">New Campus Transformation Inquiry</h2>
          <p style="color: #718096; font-size: 14px; margin-top: 0;">Received ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; color: #718096; font-size: 13px; width: 120px;">Source</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; font-weight: 600;">${site || 'campustransformation.org'}</td>
            </tr>
            ${audience ? `<tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; color: #718096; font-size: 13px;">Role</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px;">${audience}</td>
            </tr>` : ''}
            ${features && features.length > 0 ? `<tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; color: #718096; font-size: 13px;">Details</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px;">${features.join(', ')}</td>
            </tr>` : ''}
          </table>

          ${comment ? `
          <div style="background: #F7FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-top: 12px;">
            <p style="color: #718096; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Inquiry Details</p>
            <p style="color: #2D3748; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${comment}</p>
          </div>` : ''}

          <p style="color: #c00; font-size: 13px; font-weight: 700; margin-top: 16px;">RESPOND PROMPTLY — this person visited your site and took the time to fill out the form.</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Inquiry email error:', err)
    return NextResponse.json({ ok: true })
  }
}
