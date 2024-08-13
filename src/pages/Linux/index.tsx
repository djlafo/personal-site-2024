import React from 'react';
import Page from '../../components/Page';

export default function Linux() {
    return <Page>
        <p>
            Check out my custom desktop themes (Debian btw)<br/>
            <br/>
            I wrote a script and a SCSS template to generate a basic theme on the fly for the wallpaper, then add tweaks from there
        </p>
        <>
            {
                ['desk2.png', 'desk1.png', 'desk3.png', 'desk2-1.png', 'desk3-3.png', 'desk3-2.png'].map(s => <div key={s}>
                    <a href={`./${s}`} target='_blank' rel='noreferrer'><img src={`./${s}`} alt='desktop' className='large'/></a>
                    <br/>
                    <br/>
                </div>)
            }
        </>
    </Page>;
}