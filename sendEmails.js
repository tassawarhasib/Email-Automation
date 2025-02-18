require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const csv = require("csv-parser");

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // True for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

// Read the CSV file and send emails
fs.createReadStream("book1.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (!row.email || !row.filename) {
      console.warn(`⚠️ Skipping row due to missing email or filename:`, row);
      return;
    }
    
    const email = row.email;
    const filename = row.filename;
    // const attachmentPath = `certificates/${filename}`;

    console.log(`📩 Processing email: ${email}, File: ${filename}`);

    // HTML Email Template
    const htmlContent = `
    <table style="margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;" width="600" cellspacing="0" cellpadding="0" align="center">
      <tbody>
        <tr>
          <td style="background-color: #00224f; color: #fff; text-align: center; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Material Selection and Failure Analysis Certificate</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; line-height: 1.6;">
            <p>Dear ${row.name || 'Attendee'},</p>
            <p>Greetings from Excellence Integrity Management!</p>
            <p>We are pleased to inform you that your certificate for the <strong>Material Selection and Failure Analysis for Oil & Gas Applications Training</strong> is now ready. Please find your certificate attached to this email in PDF format.</p>
            <p>Thank you for your active participation and engagement during the training sessions. We hope the knowledge and skills you gained will be a valuable asset in your professional endeavors.</p>
            <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:info@excellenceintegrity.com">info@excellenceintegrity.com</a> or via WhatsApp at <strong>+971 56 130 8750</strong>.</p>
            <p>Visit our website for more - <a href="https://excellenceintegrity.com/" target="_blank">www.excellenceintegrity.com</a></p>
            <p>Once again, congratulations on successfully completing the course!</p>
            
            <!-- Buttons Section -->
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://chat.whatsapp.com/DSPanpw5ms62YqyIggOAhV" target="_blank"
                 style="background-color: #25D366; color: #fff; text-decoration: none; padding: 12px 24px; 
                        font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block; 
                        width: 90%; max-width: 300px; text-align: center; margin-bottom: 10px;">
                Join WhatsApp Group
              </a>
              <br>
              <a href="https://excellenceintegrity.com/live-training/" target="_blank"
                 style="background-color: #1856a8; color: #fff; text-decoration: none; padding: 12px 24px; 
                        font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block; 
                        width: 90%; max-width: 300px; text-align: center;">
                Check Upcoming Trainings
              </a>
            </div>

          </td>
        </tr>
        <tr>
          <td style="background-color: #00224f; color: #fff; text-align: center; padding: 20px;">
            <p style="margin: 0; font-size: 14px;">Excellence Integrity Management</p>
            <p style="margin: 0; font-size: 14px;">Email: <a style="color: #fff;" href="mailto:info@excellenceintegrity.com">info@excellenceintegrity.com</a> | Ph: +971 56 130 8750</p>
            <p style="margin: 0; font-size: 14px;"><a style="color: #fff;" href="https://www.facebook.com/excellenceintegritymanagement" target="_blank">Facebook</a> | <a style="color: #fff;" href="https://www.instagram.com/excellenceintegrity_management/" target="_blank">Instagram</a> | <a style="color: #fff;" href="https://www.linkedin.com/company/excellence-integrity-management" target="_blank">LinkedIn</a> | <a style="color: #fff;" href="https://x.com/Excellence99479" target="_blank">X</a></p>
            <p style="margin: 0; font-size: 14px;">www.excellenceintegrity.com</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;


    // Email Options
    const mailOptions = {
      from: '"Excellence Integrity Management" "nilanjansen@excellenceintegrity.com"',
      to: row.email,
      subject: "Your Material Selection and Failure Analysis Certificate from Excellence Integrity Management",
      // text: `Dear Participant,\n\nAttached is your certificate.\n\nBest regards,\n[Your Name]`,
      html: htmlContent,
      attachments: [
        {
          filename: row.filename,
          path: `./certificates/${row.filename}`
        },
      ],
    };

    // Send Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`❌ Error sending to ${email}:`, error);
      } else {
        console.log(`✅ Email sent to ${email}:`, info.response);
      }
    });
  })
  .on("end", () => {
    console.log("🎉 All emails sent successfully!");
  });
