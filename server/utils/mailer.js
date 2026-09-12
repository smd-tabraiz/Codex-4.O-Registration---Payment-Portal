const sgMail = require('@sendgrid/mail');

// ── SendGrid API Client Setup ───────────────────────────────────────────────
const initSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey || apiKey === 'YOUR_SENDGRID_API_KEY_HERE' || !apiKey.startsWith('SG.')) {
    return false; // Not configured — mock mode
  }
  sgMail.setApiKey(apiKey);
  return true;
};

/**
 * Sends a beautiful HTML confirmation email to the Team Leader via SendGrid API
 * @param {Object} registration - Registration MongoDB Document
 */
const sendConfirmationEmail = async (registration) => {
  try {
    const leader = registration.members.find((m) => m.isLeader) || registration.members[0];
    if (!leader || !leader.email) {
      console.warn(`[Mailer] No leader email found for team ${registration.teamId}`);
      return false;
    }

    // Build members table rows
    const membersRows = registration.members
      .map(
        (m, idx) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 10px 12px; color: #0F172A; font-weight: 600;">
            ${idx + 1}. ${m.name}
            ${m.isLeader
              ? '<span style="background-color: #2563EB; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; margin-left: 6px;">LEADER</span>'
              : ''}
          </td>
          <td style="padding: 10px 12px; color: #2563EB; font-family: monospace; font-weight: 600;">${m.rollNo}</td>
          <td style="padding: 10px 12px; color: #475569;">${m.year} Year (${m.branch})</td>
          <td style="padding: 10px 12px; color: #64748B;">${m.college}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Codex 4.0 Registration Confirmation</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8FAFC; color: #0F172A; margin: 0; padding: 24px;">
        <div style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 24px rgba(15,23,42,0.08);">

          <!-- Header -->
          <div style="background-color: #0F172A; padding: 32px 24px; text-align: center;">
            <div style="display: inline-block; background-color: #2563EB; padding: 12px 28px; border-radius: 10px; margin-bottom: 12px;">
              <span style="color: #FFFFFF; font-size: 24px; font-weight: 900; letter-spacing: 3px;">CODEX 4.0</span>
            </div>
            <p style="color: #CBD5E1; margin: 0; font-size: 13px; font-weight: 500;">Organized by Coders' Club, GPREC</p>
          </div>

          <!-- Success Banner -->
          <div style="background-color: #DCFCE7; border-bottom: 3px solid #16A34A; padding: 24px; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 8px;">🎉</div>
            <h2 style="color: #15803D; margin: 0 0 6px 0; font-size: 22px; font-weight: 700;">Registration Confirmed!</h2>
            <p style="color: #166534; margin: 0; font-size: 14px;">
              Payment of <strong>&#8377;${registration.paymentDetails?.amount || 300}</strong> successfully received.
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 28px 24px;">

            <!-- Team ID Highlight -->
            <div style="background-color: #EFF6FF; border: 2px dashed #2563EB; border-radius: 12px; padding: 22px; margin-bottom: 24px; text-align: center;">
              <span style="color: #1D4ED8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; display: block; margin-bottom: 8px;">YOUR UNIQUE TEAM ID</span>
              <div style="color: #0F172A; font-size: 36px; font-weight: 900; letter-spacing: 4px; font-family: 'Courier New', monospace;">${registration.teamId}</div>
              <p style="color: #64748B; font-size: 12px; margin: 10px 0 0 0;">Show this ID at the event entry desk on 24th September</p>
            </div>

            <!-- Event Details -->
            <h3 style="color: #0F172A; font-size: 15px; font-weight: 700; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin: 0 0 16px 0;">&#128197; Event Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
              <tr style="background-color: #F8FAFC;">
                <td style="padding: 9px 12px; color: #64748B; font-weight: 600; width: 140px; border: 1px solid #E2E8F0;">Event Name</td>
                <td style="padding: 9px 12px; color: #0F172A; font-weight: 700; border: 1px solid #E2E8F0;">Codex 4.0</td>
              </tr>
              <tr>
                <td style="padding: 9px 12px; color: #64748B; font-weight: 600; border: 1px solid #E2E8F0;">Date</td>
                <td style="padding: 9px 12px; color: #0F172A; border: 1px solid #E2E8F0;">24th September 2026</td>
              </tr>
              <tr style="background-color: #F8FAFC;">
                <td style="padding: 9px 12px; color: #64748B; font-weight: 600; border: 1px solid #E2E8F0;">Time</td>
                <td style="padding: 9px 12px; color: #D97706; font-weight: 700; border: 1px solid #E2E8F0;">9:00 AM &#8211; 5:00 PM (Full Day Event)</td>
              </tr>
              <tr>
                <td style="padding: 9px 12px; color: #64748B; font-weight: 600; border: 1px solid #E2E8F0;">Venue</td>
                <td style="padding: 9px 12px; color: #0F172A; border: 1px solid #E2E8F0;">GPREC Campus, Kurnool</td>
              </tr>
              <tr style="background-color: #F8FAFC;">
                <td style="padding: 9px 12px; color: #64748B; font-weight: 600; border: 1px solid #E2E8F0;">Team Name</td>
                <td style="padding: 9px 12px; color: #2563EB; font-weight: 700; border: 1px solid #E2E8F0;">${registration.teamName}</td>
              </tr>
              <tr>
                <td style="padding: 9px 12px; color: #64748B; font-weight: 600; border: 1px solid #E2E8F0;">Reporting Time</td>
                <td style="padding: 9px 12px; color: #DC2626; font-weight: 700; border: 1px solid #E2E8F0;">&#9888;&#65039; 8:30 AM Sharp</td>
              </tr>
            </table>

            <!-- Team Members Table -->
            <h3 style="color: #0F172A; font-size: 15px; font-weight: 700; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin: 0 0 16px 0;">&#128101; Registered Team Members</h3>
            <div style="border-radius: 10px; overflow: hidden; border: 1px solid #E2E8F0; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                  <tr style="background-color: #F1F5F9;">
                    <th style="padding: 10px 12px; color: #64748B; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">Member</th>
                    <th style="padding: 10px 12px; color: #64748B; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">Roll No</th>
                    <th style="padding: 10px 12px; color: #64748B; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">Year &amp; Branch</th>
                    <th style="padding: 10px 12px; color: #64748B; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">College</th>
                  </tr>
                </thead>
                <tbody>
                  ${membersRows}
                </tbody>
              </table>
            </div>

            <!-- WhatsApp Group Banner -->
            <div style="background-color: #ECFDF5; border: 1px solid #BBF7D0; padding: 20px; border-radius: 10px; margin-bottom: 24px; text-align: center;">
              <h4 style="color: #166534; margin: 0 0 6px 0; font-size: 14px; font-weight: 700;">&#128172; Join Official Participants WhatsApp Group</h4>
              <p style="color: #15803D; margin: 0 0 14px 0; font-size: 12px;">Get live problem statements, round announcements &amp; event updates.</p>
              <a href="https://chat.whatsapp.com/IuGeagGKwFEF7sdbH42dkV?s=cl&p=a&mlu=4&ilr=4" target="_blank"
                style="background-color: #16A34A; color: #FFFFFF; padding: 10px 26px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 13px; display: inline-block; letter-spacing: 0.5px;">
                &#128073; Join WhatsApp Group Now
              </a>
            </div>

            <!-- Important Guidelines -->
            <div style="background-color: #EFF6FF; border-left: 4px solid #2563EB; padding: 16px 18px; border-radius: 6px; margin-bottom: 24px;">
              <h4 style="color: #1D4ED8; margin: 0 0 10px 0; font-size: 13px; font-weight: 700;">&#128204; Important Guidelines</h4>
              <ul style="color: #1E40AF; margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.9;">
                <li><strong>Participation Certificates</strong> will be awarded to ALL registered participants!</li>
                <li>All members must carry their <strong>College ID cards</strong> for verification.</li>
                <li>Laptops and chargers are mandatory for each participating team.</li>
                <li>Report to the venue by <strong>8:30 AM</strong> for smooth check-in.</li>
              </ul>
            </div>

            <!-- Contact -->
            <p style="color: #94A3B8; font-size: 12px; text-align: center; margin: 20px 0 0 0; line-height: 1.8;">
              Questions? Contact the Coders' Club GPREC organizing team:<br>
              <strong style="color: #64748B;">Email:</strong> codersclubrecuirtment@gmail.com &nbsp;|&nbsp;
              <strong style="color: #64748B;">Phone:</strong> +91 9391491123<br><br>
              &#128187; Happy Coding &amp; All the Best!
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #0F172A; padding: 16px 24px; text-align: center;">
            <p style="color: #475569; font-size: 11px; margin: 0;">&copy; 2026 Coders' Club, GPREC. All rights reserved.</p>
          </div>

        </div>
      </body>
      </html>
    `;

    // ── Mock mode if API key not set ──────────────────────────────────────
    const isConfigured = initSendGrid();
    if (!isConfigured) {
      console.log(`[Mailer MOCK] SendGrid not configured. Email would be sent to ${leader.email} for Team ${registration.teamId}`);
      return true;
    }

    // ── Send via SendGrid ──────────────────────────────────────────────────
    const msg = {
      to: {
        email: leader.email,
        name: leader.name,
      },
      from: {
        email: process.env.EMAIL_FROM_ADDRESS || 'codersclub.gprec@gmail.com',
        name: "Coders' Club GPREC",
      },
      replyTo: {
        email: 'codersclub@gprec.ac.in',
        name: "Coders' Club GPREC",
      },
      subject: `[CONFIRMED] Codex 4.0 Registration — Team ID: ${registration.teamId} (${registration.teamName})`,
      html: htmlContent,
    };

    const [response] = await sgMail.send(msg);
    console.log(`[Mailer] ✅ SendGrid email sent to ${leader.email} for Team ${registration.teamId}. Status: ${response.statusCode}`);
    return true;

  } catch (error) {
    const errDetail = error?.response?.body?.errors?.[0]?.message || error.message || String(error);
    console.error(`[Mailer] ❌ Error sending email for team ${registration.teamId}:`, errDetail);
    // Non-blocking — registration itself must not fail due to email error
    return false;
  }
};

module.exports = { sendConfirmationEmail };
