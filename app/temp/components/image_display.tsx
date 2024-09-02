'use client'

import Image from 'next/image';

const ImageDisplay = () => {
    return (
        <div className="md:hidden">
            <Image
                alt="Forms"
                loading="lazy"
                width={1280}
                height={791}
                className="block dark:hidden"
                src="/examples/forms-light.png"
            />
            <Image
                alt="Forms"
                loading="lazy"
                width={1280}
                height={791}
                className="hidden dark:block"
                src="/examples/forms-dark.png"
            />
        </div>
    );
};

export default ImageDisplay;
