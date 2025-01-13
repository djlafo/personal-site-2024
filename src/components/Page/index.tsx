import React from 'react';
import HeaderBar from './HeaderBar';
import './page.css';

function Page({ children }: { children: React.ReactNode }) {
    return (
        <div className='page'>
            <nav>
                <HeaderBar/>
            </nav>
            <section>
                {children}
            </section>
        </div>
    );
}


export default Page;