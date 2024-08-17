import React, { useState, useEffect } from 'react';
import Page from '../../components/Page';
import './linux.css';

const images = ['desk2.png', 'desk1.png', 'desk3.png', 'desk2-1.png', 'desk3-3.png', 'desk3-2.png'];

export default function Linux() {
    const [activeImage, setActiveImage] = useState(0);

    const increment = (n: number, inc: number) : number => {
        const res = n + inc;
        if(res < 0) return images.length-1;
        if(res >= images.length) return 0;
        return res;
    };

    useEffect(() => {
		const shiftActive = (e : KeyboardEvent) => {
            if(e.key === 'ArrowLeft') {
                setActiveImage(a => increment(a, -1));
            } else if (e.key === 'ArrowRight') {
                setActiveImage(a => increment(a, 1));
            }
		};

		window.addEventListener('keydown', shiftActive);
		return () => {
			window.removeEventListener('keydown', shiftActive);
		}
	}, [setActiveImage])

    return <Page>
        <p>
            Check out my custom desktop themes (Debian btw)<br/>
            <br/>
            I wrote a script and a SCSS template to generate a basic theme on the fly for the wallpaper, then add tweaks from there
        </p>
        <div className='linux'>
            <span>
                <input type='button' value='<' onClick={() => setActiveImage(a => increment(a, - 1))}/>
                {activeImage+1} / {images.length}
                <input type='button' value='>' onClick={() => setActiveImage(a => increment(a, 1))}/>
            </span>
            <a href={`./${images[activeImage]}`} 
                target='_blank' rel='noreferrer'>
                    <img src={`./${images[activeImage]}`} 
                        alt='desktop' 
                        className='large'/>
            </a>
        </div>
    </Page>;
}