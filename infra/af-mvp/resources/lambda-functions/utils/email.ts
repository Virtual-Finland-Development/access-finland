import { EmailContent } from '@aws-sdk/client-sesv2';

function wrapHtmlEmailContentWithCoreStructure(
  title: string,
  htmlBodyContent: string
) {
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
      }
    </style>
  </head>
  <body>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
      <tr>
        <td>
          ${htmlBodyContent}
          <hr />
          <p>This message cannot be replied to.</p>
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
  const siteUrl = process.env.SITE_URL!;
  return wrapHtmlEmailContentWithCoreStructure(
    'Confirm your login to Virtual Finland',
    `
    <h1>Confirm your login</h1>
    <p>Confirm your login by entering the following code in the Virtual Finland service:</p>
    <p class='code-text' style='font-size: 20px; line-height: 30px; font-weight: bold;'>${secretLoginCode}</p>
    <p>After entering the code, you can continue logging in to the Access Finland service:</p>
    <p><a href='${siteUrl}'>${siteUrl}</a></p>
    `
  );
}

export function createEmailContentForCodeConfirmation(
  secretLoginCode: string
): EmailContent {
  return {
    Simple: {
      Subject: {
        Charset: 'UTF-8',
        Data: `Virtual Finland confirmation code: ${secretLoginCode}`,
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: createEmailHtmlContent(secretLoginCode),
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Confirm your login by entering the following code in the Virtual Finland service: ${secretLoginCode}`,
        },
      },
    },
  };
}
