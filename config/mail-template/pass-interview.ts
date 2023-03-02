import dayjs from "dayjs";

export const generatePassInterviewEmail = ({ name, jobTitle }: any) => {
  const nextWeek = dayjs().add(7, "days").format("DD/MM/YYYY");
  const nextThreeDays = dayjs().add(3, "days").format("DD/MM/YYYY");

  return `
    <p>Dear<strong><span>&nbsp;${name},</span></strong></p>
    <p>Thank you for your application for the post of&nbsp;<strong>${jobTitle}</strong>. We are pleased to inform you that we were very impressed when we met you in person and we would like to offer you the position, starting on&nbsp;<i>${nextWeek}</i>.</p>
    <p><br />We picked you out of a large number of applicants as we were won over by your creativity throughout the application process, your specialist expertise, and your professional experience.</p>
    <p>We hope that you are interested in working with us and I would ask you to get back to me by&nbsp;<strong>${nextThreeDays}&nbsp;</strong>regarding the next steps and your ultimate decision.</p>
    <p><br />I take the liberty of attaching the relevant employment contract for you to read through. Should you have any more questions, then please do not hesitate to contact me at any time.</p>
    <p>We are looking forward to welcoming you to our team and are hoping for a positive response on your part.</p>
    <p>Best wishes</p>
    <p>MyHRM Admin</p>
        `;
};
