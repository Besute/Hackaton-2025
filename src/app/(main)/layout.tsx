"use client"

import AccessProvider from '@/src/components/context/access';
import { ReactNode } from 'react';

const MainLayout = function ({ children } : { children : ReactNode}) {
    return (
        <AccessProvider>
            {children}
        </AccessProvider>
    )
}

export default MainLayout