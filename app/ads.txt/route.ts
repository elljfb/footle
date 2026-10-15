import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.redirect(
    'https://srv.adstxtmanager.com/19390/footle.club',
    301,
  );
}
