import { NextRequest, NextResponse } from 'next/server';

export default function proxy(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value;
    const isAuthPage =
        req.nextUrl.pathname.startsWith('/login') ||
        req.nextUrl.pathname.startsWith('/register');

    if (!token && !isAuthPage)
        return NextResponse.redirect(new URL('/login', req.url));
    if (token && isAuthPage)
        return NextResponse.redirect(new URL('/', req.url));

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
