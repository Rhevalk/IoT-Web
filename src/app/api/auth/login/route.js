import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const ADMIN_CODE = "admin123";
const HASHED_PASSWORD = "$2b$08$.N87MFT/XjDhUwNOkjzNouuGS/Scxk9bsxx8J0QLZVelJyrAt//Qm"; // hash password

export async function POST(request) {
  const { code, password } = await request.json();

  if (code !== ADMIN_CODE) {
    return NextResponse.json({ message: "Kode salah" }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(password, HASHED_PASSWORD);
  if (!validPassword) {
    return NextResponse.json({ message: "Password salah" }, { status: 401 });
  }

  const sessionToken = Buffer.from(`${code}:${Date.now()}`).toString('base64');

  const response = NextResponse.json({ message: "Login sukses" }, { status: 200 });
  response.cookies.set('admin_session', sessionToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
