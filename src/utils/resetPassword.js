const textTemplate = (name, otpCode) => `
Hi ${name},

We received a request to reset the password for your account.

To proceed with resetting your password, please use the verification code
provided below.

${otpCode}

This code is valid for the next 10 minutes. If you did not request this, please
ignore this email.

For your security, please do not share this code with anyone.

Thanks,`;

const htmlTemplate = (name, otpCode) => {
  const [digit1, digit2, digit3, digit4, digit5, digit6] = otpCode.split('');

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--$-->
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    Your OTP code to reset your password
    <div>
       ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    </div>
  </div>
  <body
    style="
      background-color: #f6f9fc;
      font-family: Arial, sans-serif;
      padding: 20px;
    "
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 600px;
        background-color: #ffffff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        margin: 0 auto;
        border: 1px solid #ddd;
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <img
              alt="ROOM Logo"
              src="https://res.cloudinary.com/dio6jutii/image/upload/v1745086843/x71tqxbgyoj7nqh5uolo.png"
              style="
                display: block;
                outline: none;
                border: none;
                text-decoration: none;
                margin: auto;
              "
              width="100"
            />
            <div
              style="border-bottom: 1px solid #ddd; margin: 40px 0 20px"
            ></div>
            <p
              style="
                font-size: 20px;
                line-height: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #1e1e1e;
                margin-top: 16px;
              "
            >
              Hi
              <!-- -->${name}<!-- -->,
            </p>
            <p
              style="
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 16px;
                color: #333;
                margin-top: 16px;
              "
            >
              We received a request to reset the password for your account.
            </p>
            <p
              style="
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 16px;
                color: #333;
                margin-top: 16px;
              "
            >
              To proceed with resetting your password, please use the
              verification code provided below.
            </p>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align: center; margin-top: 16px"
            >
              <tbody>
                <tr>
                  <td>
                    <div
                      style="
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: rgba(55, 146, 222, 0.1);
                        border-radius: 8px;
                        color: #3792de;
                      "
                    >
                      <span
                        style="
                          display: inline-block;
                          font-size: 24px;
                          margin: 0 4px;
                          font-weight: bold;
                          color: #3792de;
                        "
                        >${digit1}</span
                      ><span
                        style="
                          display: inline-block;
                          font-size: 24px;
                          margin: 0 4px;
                          font-weight: bold;
                          color: #3792de;
                        "
                        >${digit2}</span
                      ><span
                        style="
                          display: inline-block;
                          font-size: 24px;
                          margin: 0 4px;
                          font-weight: bold;
                          color: #3792de;
                        "
                        >${digit3}</span
                      ><span
                        style="
                          display: inline-block;
                          width: 8px;
                          height: 2px;
                          background-color: #3792de;
                          margin: 0 8px;
                          vertical-align: middle;
                        "
                      ></span
                      ><span
                        style="
                          display: inline-block;
                          font-size: 24px;
                          margin: 0 4px;
                          font-weight: bold;
                          color: #3792de;
                        "
                        >${digit4}</span
                      ><span
                        style="
                          display: inline-block;
                          font-size: 24px;
                          margin: 0 4px;
                          font-weight: bold;
                          color: #3792de;
                        "
                        >${digit5}</span
                      ><span
                        style="
                          display: inline-block;
                          font-size: 24px;
                          margin: 0 4px;
                          font-weight: bold;
                          color: #3792de;
                        "
                        >${digit6}</span
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 16px;
                color: #333;
                margin-top: 16px;
              "
            >
              This code is valid for the next 10 minutes. If you did not request
              this, please ignore this email.
            </p>
            <p
              style="
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 16px;
                color: #333;
                margin-top: 16px;
              "
            >
              For your security, please do not share this code with anyone.
            </p>
            <p
              style="
                font-size: 16px;
                line-height: 24px;
                margin-top: 32px;
                color: #333;
                margin-bottom: 16px;
              "
            >
              Thanks,
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
<!--/$-->
`;
};

module.exports = {
  textTemplate,
  htmlTemplate,
};
