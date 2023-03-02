export const generateFailInterviewEmail = ({ name, jobTitle }: any) => {
  return `
    <p>Dear<strong><span>&nbsp;${name},</span></strong></p>
    <p>We sincerely thank you for taking the time to apply and meet with our team about the ${jobTitle}. We enjoyed learning more about your past achievements as well as your skills and qualifications.</p>
    <p>We regret to inform you that we&rsquo;ve selected another candidate. We received many applications at our company from experienced and qualified applicants, and competition is extremely high.</p>
    <p>In the event any openings come up, we&rsquo;ll keep your information on file.</p>
    <p>Please feel free to contact me for more detailed feedback about our hiring process.</p>
    <p>Regards,</p>
    <p>MyHRM Admin</p>
      `;
};
