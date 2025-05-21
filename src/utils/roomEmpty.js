const emptyRoomTextTemplate = (
  userName = 'user name',
  date = 'April 22, 2025',
  bookingId = 'BD-4de6e1',
  Room = 'Meeting Room A',
) => {
  return `
Hi ${userName},

Good news! The room you previously reserved, ${Room}, is now available.

Your reservation request was previously placed on the waitlist due to the room’s
unavailability. However, as the prior booking has been cancelled, the room is
now available for you to reserve.

- Booking ${bookingId}
- Date Requested ${date}
- Room ${Room}

Please visit our booking platform to confirm your reservation as soon as
possible.

If you do not want to reserve this room, you can ignore this message.

Thanks for using ROOM!`;
};

const emptyRoomHtmlTemplate = (
  userName = 'user name',
  date = 'April 22, 2025',
  bookingId = 'BD-4de6e1',
  Room = 'Meeting Room A',
) => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--$-->
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
    Your reserved room is now available for re-booking!
    <div>
       ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    </div>
  </div>
  <body
    style="background-color:#f6f9fc;font-family:Arial, sans-serif;padding:20px">
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:600px;background-color:#ffffff;padding:40px;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.1);margin:0 auto;border:1px solid #ddd">
      <tbody>
        <tr style="width:100%">
          <td>
            <img
              alt="ROOM Logo"
              src="https://res.cloudinary.com/dio6jutii/image/upload/v1745086843/x71tqxbgyoj7nqh5uolo.png"
              style="display:block;outline:none;border:none;text-decoration:none;margin:auto"
              width="100" />
            <div style="border-bottom:1px solid #ddd;margin:40px 0 20px"></div>
            <p
              style="font-size:20px;line-height:24px;font-weight:bold;margin-bottom:20px;color:#1e1e1e;margin-top:16px">
              Hi
              <!-- -->${userName}<!-- -->,
            </p>
            <p
              style="font-size:16px;line-height:1.6;margin-bottom:16px;color:#333;margin-top:16px">
              Good news! The room you previously reserved,
              <strong>Meeting Room A</strong>, is now available.
            </p>
            <p
              style="font-size:16px;line-height:1.6;margin-bottom:16px;color:#333;margin-top:16px">
              Your reservation request was previously placed on the waitlist due
              to the room’s unavailability. However, as the prior booking has
              been cancelled, the room is now available for you to reserve.
            </p>
            <table style="border-collapse:collapse;width:100%">
              <tbody>
                <tr>
                  <td style="padding:8px;border:1px solid #e0e0e0">
                    <strong>Booking ID</strong>
                  </td>
                  <td style="padding:8px;border:1px solid #e0e0e0">
                    ${bookingId}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px;border:1px solid #e0e0e0">
                    <strong>Date Requested</strong>
                  </td>
                  <td style="padding:8px;border:1px solid #e0e0e0">
                    ${date}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px;border:1px solid #e0e0e0">
                    <strong>Room</strong>
                  </td>
                  <td style="padding:8px;border:1px solid #e0e0e0">
                    ${Room}
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="font-size:16px;line-height:1.6;margin-bottom:16px;color:#333;margin-top:16px">
              Please visit our booking platform to confirm your reservation as
              soon as possible.
            </p>
            <p
              style="font-size:16px;line-height:1.6;margin-bottom:16px;color:#333;margin-top:16px">
              If you do not want to reserve this room, you can ignore this
              message.
            </p>
            <p
              style="font-size:16px;line-height:24px;margin-top:32px;color:#333;margin-bottom:16px">
              Thanks for using <b>ROOM</b>!
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
  emptyRoomTextTemplate,
  emptyRoomHtmlTemplate,
};
