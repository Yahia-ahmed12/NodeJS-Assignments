import { envConfig } from "../../../config/config.js";
import { EmailSubjectEnum } from "../../enum/email.enum.js";

const appName = envConfig.APPLICATION_NAME || "Saraha";

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

// دالة مساعدة لتوليد هيكل القالب الموحد (Layout)
const baseEmailLayout = ({ title, message, code, actionText, actionUrl }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title || appName)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f3f3; font-family: Arial, Helvetica, sans-serif;">
  <div style="width: 100%; padding: 30px 0; background-color: #f1f3f3;">
    <div style="max-width: 580px; margin: 0 auto; padding: 30px; background-color: #f1f3f3; border: 1px solid #6b102f; box-sizing: border-box;">

      <!-- Email Header -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
        <tr>
          <td align="left" valign="middle">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #111111; letter-spacing: -1px;">
              ◉ SAR<span style="color: #6b102f;">AHA</span>
            </h1>
          </td>
          <td align="right" valign="middle">
            ${
              actionUrl
                ? `<a href="${escapeHtml(actionUrl)}" style="color: #2864a5; font-size: 12px; text-decoration: none;">View In Website</a>`
                : ""
            }
          </td>
        </tr>
      </table>

      <!-- Email Content -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
        <!-- Burgundy Banner -->
        <tr>
          <td align="center" style="background-color: #6b102f; padding: 18px;">
            <div style="font-size: 48px; line-height: 1.2; color: #ffffff;">&#9993;</div>
          </td>
        </tr>

        <!-- Email Title -->
        <tr>
          <td align="center" style="padding: 38px 20px 24px;">
            <h2 style="margin: 0; color: #6b102f; font-size: 23px; font-weight: 700;">
              ${escapeHtml(title || "Notification")}
            </h2>
          </td>
        </tr>

        <!-- Email Message -->
        <tr>
          <td align="center" style="padding: 0 28px 20px; color: #444444; font-size: 15px; line-height: 1.8; word-break: break-word;">
            ${escapeHtml(message || "")}
          </td>
        </tr>

        <!-- Verification Code -->
        ${
          code
            ? `
        <tr>
          <td align="center" style="padding: 0 28px 28px;">
            <div style="background-color: #6b102f; color: #ffffff; padding: 12px 16px; display: inline-block; min-width: 200px; text-align: center; font-size: 22px; font-weight: 700; letter-spacing: 4px; border-radius: 4px;">
              ${escapeHtml(code)}
            </div>
          </td>
        </tr>
        `
            : ""
        }

        <!-- Action Button -->
        ${
          actionUrl && actionText
            ? `
        <tr>
          <td align="center" style="padding: 0 20px 30px;">
            <a href="${escapeHtml(actionUrl)}" target="_blank" style="display: inline-block; background-color: #6b102f; color: #ffffff; padding: 13px 30px; border-radius: 4px; font-size: 15px; font-weight: 600; text-decoration: none;">
              ${escapeHtml(actionText)}
            </a>
          </td>
        </tr>
        `
            : ""
        }
      </table>

      <!-- Stay In Touch -->
      <div style="text-align: center; padding: 18px 0 20px;">
        <p style="margin: 0; color: #111111; font-size: 14px; font-weight: 700;">Stay in touch</p>
      </div>

      <!-- Social Media -->
      <table align="center" cellpadding="0" cellspacing="0">
        <tr>
          ${
            envConfig.facebookLink
              ? `
          <td align="center" style="padding: 0 9px;">
            <a href="${escapeHtml(envConfig.facebookLink)}" target="_blank" style="display: inline-block; width: 44px; height: 44px; line-height: 44px; text-align: center; background-color: #1877f2; color: #ffffff; border-radius: 50%; font-size: 22px; font-weight: bold; text-decoration: none;">f</a>
          </td>
          `
              : ""
          }

          ${
            envConfig.instagram
              ? `
          <td align="center" style="padding: 0 9px;">
            <a href="${escapeHtml(envConfig.instagram)}" target="_blank" style="display: inline-block; width: 44px; height: 44px; line-height: 44px; text-align: center; background-color: #E4405F; border-radius: 50%; text-decoration: none;">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="Instagram" width="22" height="22" style="display: inline-block; width: 22px; height: 22px; vertical-align: middle; border: 0;" />
            </a>
          </td>
          `
              : ""
          }

          ${
            envConfig.twitterLink
              ? `
          <td align="center" style="padding: 0 9px;">
            <a href="${escapeHtml(envConfig.twitterLink)}" target="_blank" style="display: inline-block; width: 44px; height: 44px; line-height: 44px; text-align: center; background-color: #3998d0; color: #ffffff; border-radius: 50%; font-size: 20px; font-weight: bold; text-decoration: none;">t</a>
          </td>
          `
              : ""
          }
        </tr>
      </table>

      <!-- Footer -->
      <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #dddddd; text-align: center;">
        <p style="margin: 0 0 10px; color: #555555; font-size: 12px; line-height: 1.7;">
          If you didn't request this action, you can safely ignore this email.
        </p>
        <p style="margin: 0; color: #777777; font-size: 11px;">
          &copy; ${new Date().getFullYear()} ${escapeHtml(appName)}. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
};

export const templates = {
  [EmailSubjectEnum.CONFIRM_EMAIL]: (data) => {
    return baseEmailLayout({
      title: data.title || "Confirm Your Email",
      message:
        data.message ||
        "Please use the confirmation code below to activate your account:",
      code: data.code,
      actionText: data.actionText,
      actionUrl: data.actionUrl,
    });
  },

  [EmailSubjectEnum.FORGOT_PASSWORD]: (data) => {
    return baseEmailLayout({
      title: data.title || "Reset Your Password",
      message:
        data.message ||
        "We received a request to reset your password. Use the code below or click the button:",
      code: data.code,
      actionText: data.actionText || "Reset Password",
      actionUrl: data.actionUrl,
    });
  },
};

export const verifyEmailTemplate = (data) => {
  const templateFn = templates[data.subject];

  if (!templateFn) {
    throw new Error(`❌ Unsupported email template subject: [${data.subject}]`);
  }

  return templateFn(data);
};
