
import { notFound } from 'next/navigation';
import { createClient } from "@vercel/postgres";
import type { User } from '@/app/lib/definitions';
import { Suspense } from "react";
import {
    CardsSkeleton,
} from "@/app/ui/skeletons";
import { lusitana } from "@/app/ui/fonts";

async function getUser(email: string): Promise<User | undefined> {
    console.log('getUser:', email);
    const client = await createClient();
    await client.connect();

    try {
        const user = await client.sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    } finally {
        client.end();
    }
}

export default async function Page(props: { params: Promise<{ userId: string }> }) {
    const params = await props.params;
    const id = params.userId;
    const decodedUserId = decodeURIComponent(id);
    const user = await getUser(decodedUserId);
    // const [invoice, customers] = await Promise.all([
    //     fetchInvoiceById(id),
    //     fetchCustomers(),
    // ]);

    if (!user) {
        notFound();
    }

    console.log('user:', JSON.stringify(user));

    return (
        <main className="p-4">
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                User Profile
            </h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-lg font-semibold">User ID: <span className="font-normal">{user.id}</span></p>
                <p className="text-lg font-semibold">Name: <span className="font-normal">{user.name}</span></p>
                <p className="text-lg font-semibold">Email: <span className="font-normal">{user.email}</span></p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                {/* Add any additional profile components here */}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    {/* Add any additional profile components here */}
                </Suspense>
            </div>
        </main>
    );
}
