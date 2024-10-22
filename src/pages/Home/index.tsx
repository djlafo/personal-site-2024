import React from 'react';

import { Page, GlowBackdrop } from '../../components';
import Resume from '../../documents/Resume.pdf';
import './home.css';

function Home() {
    return <Page>
        <GlowBackdrop id='selfie-glow' deviation='7'/>
        <div className='home'>
            <h1>
                Hello, I'm Dylan Lafont
            </h1>
            <img src='./selfie.jpg' 
                style={{filter: 'url(#selfie-glow)'}}
                className='selfie' 
                alt='selfie'/>
            <p>
                A while ago, I took a sabbatical from work to focus on long-term mental health issues that made normal life difficult for me, such as agoraphobia.
                <br/>
                <br/>
                I'm happy to say I was successful. I've grown a lot as a person, and I'm now ready to hop back into code.
                <br/>
                <br/>
                I'll be using the rest of the website to throw useful tools in for me and misc stuff
                <br/>
                <br/>
                Here's my <a href={Resume} target='_blank' rel='noreferrer'>resume</a>
            </p>
        </div>
    </Page>;
}

export default Home;