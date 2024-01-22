/* eslint-disable turbo/no-undeclared-env-vars */
import { EmailContent } from '@aws-sdk/client-sesv2';
import { createHash } from 'crypto';

function wrapHtmlEmailContentWithCoreStructure(
  title: string,
  htmlBodyContent: string
) {
  const siteUrl = process.env.SITE_URL!;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 20px;
      }
    </style>
  </head>
  <body>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
      <tr>
        <td>
      ${htmlBodyContent}
          <hr />
          <p style="font-size:12px;text-align:center">This message cannot be replied to.</p>
          <p style="font-size:12px;text-align:center">Access Finland: ${siteUrl}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Html template for the code confirmation email
 *
 * @param secretLoginCode
 * @returns
 */
function createEmailHtmlContent(secretLoginCode: string) {
  return wrapHtmlEmailContentWithCoreStructure(
    'Confirm your login to Virtual Finland',
    `
    <h1>Confirm your login</h1>
    <p>Confirm your login by entering the following code in the Virtual Finland service:</p>
    <p class='code-text' style='font-size: 20px; line-height: 30px; font-weight: bold;'>${secretLoginCode}</p>
    <p>After entering the code, you can continue logging in to the Access Finland service.</p>
    `
  );
}

function createEmailTextContent(secretLoginCode: string) {
  return `Confirm your login by entering the following code in the Virtual Finland service:\r\n${secretLoginCode}`;
}

export function createEmailContentForCodeConfirmation(
  secretLoginCode: string,
  recipient: string
): EmailContent {
  const sender = process.env.SES_FROM_ADDRESS!;
  const mimeBoundary = `vf_${createHash('md5')
    .update(secretLoginCode)
    .digest('hex')}`;

  const emailContent = `From: "Virtual Finland" <${sender}>
To: ${recipient}
Subject: Virtual Finland confirmation code: ${secretLoginCode}
Content-Type: multipart/alternative;
  boundary="${mimeBoundary}"

--${mimeBoundary}
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: quoted-printable

${createEmailTextContent(secretLoginCode)}

--${mimeBoundary}
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: base64

${Buffer.from(createEmailHtmlContent(secretLoginCode)).toString('base64')}

--${mimeBoundary}--`;

  return {
    Raw: {
      Data: Buffer.from(emailContent),
    },
  };
}
