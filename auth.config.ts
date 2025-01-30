import type { NextAuthConfig } from 'next-auth';
import { createClient } from "@vercel/postgres";
import type { User } from '@/app/lib/definitions';
import { z } from 'zod';

// async function getUser(email: string): Promise<User | undefined> {
//     const client = await createClient();
//     await client.connect();

//     try {
//         const user = await client.sql<User>`SELECT * FROM users WHERE email=${email}`;
//         return user.rows[0];
//     } catch (error) {
//         console.error('Failed to fetch user:', error);
//         throw new Error('Failed to fetch user.');
//     } finally {
//         client.end();
//     }
// }

export const authConfig = {
    providers: [],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            if (isLoggedIn) {
                const email = auth?.user?.email;
                if (!email) {
                    throw new Error('User email is not available');
                }
                // const user = await getUser(email);
                const isOnUserProfile = nextUrl.pathname.startsWith(`/profile/${email}`);
                if (isOnUserProfile) {
                    return true;
                } else {
                    return Response.redirect(new URL(`/profile/${email}`, nextUrl));
                }
            } else {
                return false; // Redirect unauthenticated users to login page
            }

        }
    },
} satisfies NextAuthConfig;