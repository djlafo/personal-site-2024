import React from 'react';
import HeaderBar from './HeaderBar';
import './page.css';

function Page({ children }: { children: JSX.Element | Array<JSX.Element> }) {
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