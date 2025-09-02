import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message, priority } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, 
                ciphers: 'SSLv3',
            },
            // Additional Gmail-specific options
            requireTLS: true,
            connectionTimeout: 60000,
            greetingTimeout: 30000,
            socketTimeout: 60000,
        });

        // Verify transporter configuration
        await transporter.verify();

        const priorityEmoji = {
            low: '🟢',
            medium: '🟡',
            high: '🔴',
        };

        const priorityStyles: Record<string, string> = {
            high: 'background-color: #fee2e2; color: #991b1b;',
            medium: 'background-color: #fef3c7; color: #92400e;',
            low: 'background-color: #d1fae5; color: #065f46;',
        };

        const responseTimes: Record<string, string> = {
            high: 'High Priority: Within 4-6 hours',
            medium: 'Medium Priority: Within 24 hours',
            low: 'Low Priority: Within 48 hours',
        };

        const priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);

        // Email to you (the recipient)
        const mailToYou = {
            from: process.env.EMAIL_USER,
            to: process.env.CONTACT_EMAIL,
            subject: `${priorityEmoji[priority as keyof typeof priorityEmoji]} Contact Form: ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Message
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 5px 0;"><strong>Priority:</strong> 
                <span style="display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; ${priorityStyles[priority]}">
                  ${priorityEmoji[priority as keyof typeof priorityEmoji]} ${priorityLabel} Priority
                </span>
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Contact Details:</h3>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
              <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
              <p>This message was sent from your portfolio contact form on ${new Date().toLocaleString('en-US', {
                timeZone: 'Africa/Lagos',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })} (WAT)</p>
              <p style="margin-top: 10px;">
                <a href="mailto:${email}?subject=Re: ${subject}" 
                   style="display: inline-block; background-color: #007bff; color: white; padding: 8px 16px; 
                          text-decoration: none; border-radius: 4px; font-size: 14px;">
                  Reply to ${name}
                </a>
              </p>
            </div>
          </div>
        </div>
      `,
        };

        // Confirmation email to the sender
        const mailToSender = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Thanks for reaching out, ${name}!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Thanks for getting in touch!</h2>
            
            <p style="color: #555; line-height: 1.6;">Hi ${name},</p>
            
            <p style="color: #555; line-height: 1.6;">
              Thanks for reaching out through my portfolio! I've received your message about 
              "<strong>${subject}</strong>" and I'll get back to you soon.
            </p>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h4 style="color: #333; margin-bottom: 10px;">Expected Response Time:</h4>
              <ul style="color: #555; margin: 0; padding-left: 20px;">
                <li>${responseTimes[priority]}</li>
                <li>Project collaborations: Same day</li>
                <li>Weekends might have slightly longer response times</li>
              </ul>
            </div>

            <p style="color: #555; line-height: 1.6;">
              In the meantime, feel free to check out my other projects on my portfolio or connect with me on social media.
            </p>

            <p style="color: #555; line-height: 1.6;">
              Best regards,<br>
              <strong>Ezra Agun</strong><br>
              <small style="color: #888;">Full Stack Developer & AI Enthusiast</small>
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
              <p><strong>Your message summary:</strong></p>
              <p>Subject: ${subject}</p>
              <p>Priority: ${priorityLabel}</p>
              <p>Sent: ${new Date().toLocaleString('en-US', {
                timeZone: 'Africa/Lagos',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })} (WAT)</p>
            </div>
          </div>
        </div>
      `,
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(mailToYou),
            transporter.sendMail(mailToSender),
        ]);

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully!',
        });
    } catch (error) {
        console.error('Email error:', error);

        return NextResponse.json(
            {
                error: 'Failed to send email. Please try again later.',
                details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
            },
            { status: 500 }
        );
    }
}