// UnderMaintenance.tsx

import React from 'react';
import Image from 'next/image';

const UnderMaintenance = () => {
return (
<div className="maintenance-container flex flex-col items-center justify-center min-h-screen bg-dark-1 text-light-1">
    <h1 className="maintenance-heading text-heading1-bold mb-4">We'll be back soon!</h1>
    <p className="maintenance-message text-base-regular mb-8">
    Sorry for the inconvenience but we're performing some maintenance at the moment.
    We'll be back online shortly!
    </p>
    <div className="relative">
    <Image
        src="/assets/Maintenance.png" // Ensure this path is correct
        alt="Maintenance"
        height={400} // Adjust dimensions
        width={500} // Adjust dimensions
    />
    </div>
</div>
);
};

export default UnderMaintenance;
