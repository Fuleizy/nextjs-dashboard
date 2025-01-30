'use client';

import { Button } from '@/app/ui/button';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { cancelSignUpButton } from '@/app/lib/actions';

export default function CancelSignUpButton() {
    return (
        <Button className="mt-4 w-full" onClick={
            () => {
                console.log('Test button clicked');
                cancelSignUpButton();
            }
        }>
            Cancel <XCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    );
}

