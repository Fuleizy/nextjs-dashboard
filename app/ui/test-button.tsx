'use client';

import { Button } from '@/app/ui/button';
import { BeakerIcon } from '@heroicons/react/20/solid';

export default function TestButton() {
    return (
        <Button className="mt-4 w-full" onClick={
            () => {
                console.log('Test button clicked');
            }
        }>
            Test Button <BeakerIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    );
}