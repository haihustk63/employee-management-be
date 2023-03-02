export const generateNewAccountEmail = ({ name, email, password }: any) => {
  return `
    <p><strong>Hello ${name},</strong></p>

    <p>We have created a new account which you can use to login into our system.</p>
    <p>This is your account:</p>

    <ul>
    <li>Email: ${email}</li>
    <li>Password: ${password}</li>
    </ul>

    <p><strong>Please change password right after successfully login to protect your account.</strong></p>
    `;
};
