import nodemailer from 'nodemailer';
import { User } from '@prisma/client';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (user: User, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'パスワードリセットのご案内',
    html: `
      <p>${user.name} 様</p>
      <p>パスワードリセットのリクエストを受け付けました。</p>
      <p>以下のリンクをクリックして、新しいパスワードを設定してください：</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>このリンクは1時間のみ有効です。</p>
      <p>パスワードリセットをリクエストしていない場合は、このメールを無視してください。</p>
    `,
  });
};