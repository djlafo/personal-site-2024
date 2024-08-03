import React from 'react';

import { Page } from '../../components';
import Resume from '../../documents/Resume.pdf';

function Home() {
    return <Page>
        <div>
            <h1>
                Hello, I'm Dylan Lafont
            </h1>
            <p>
                This is just a simple site, so don't look for anything fancy here.
            </p>
            <p>
                A while ago, I took a sabbatical from work to spend much time and effort working on mental health issues, such as agoraphobia, that have made
                normal life difficult for me for a while. 
                I'm happy to say I was successful. I've grown a lot as a person, and I'm now ready to hop back into code.
            </p>
            <p>
                Here's my <a href={Resume} target='_blank' rel='noreferrer'>resume</a>
            </p>
            <p>
                I'll be using the rest of the website to throw useful tools in for me
            </p>
        </div>
    </Page>;
}

export default Home;