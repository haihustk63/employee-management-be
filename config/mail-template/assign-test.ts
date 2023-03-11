import dayjs from "dayjs";

export const assignTestEmail = ({
  candidateName,
  testTitle,
  duration,
}: any) => {
  return `
    <p>Dear <strong>${candidateName},</strong></p>
    <p>Thank you again for applying to our company. As a part of our selection process, we send skill tests to selected candidates, and you are one of them!&nbsp;</p>
    <p>Here is your test's information:</p>
    <ul>
    <li>Title: <strong>${testTitle}</strong></li>
    <li>Duration: <strong>${duration} minutes</strong></li>
    <li>Due date: <strong>${dayjs()
      .add(2, "day")
      .format("DD/MM/YYYY")}</strong></li>
    </ul>
    <p>Please login to our system using the account which we sent you before. If you have any other questions about the tests, please don't hesitate to ask!</p>
    <p>Good luck with the test, and I am looking forward to reading your answers,</p>
    <div>
    <div><span>Regards,</span></div>
    <div><span>MyHRM Admin</span></div>
    </div>
        `;
};
