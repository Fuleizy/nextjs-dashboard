'use client';

import { Button } from '@/app/ui/button';
import { UserIcon } from '@heroicons/react/20/solid';
import { signUpButton } from '@/app/lib/actions';

export default function SignUpButton() {
    return (
        <Button className="mt-4 w-full" onClick={
            () => {
                console.log('Test button clicked');
                signUpButton();
            }
        }>
            Sign Up <UserIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    );
}

