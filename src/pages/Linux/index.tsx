import React, { useState, useEffect } from 'react';
import { Page, GlowBackdrop } from '../../components';
import './linux.css';

const images = ['desk2.png', 'desk1.png', 'desk3.png', 'desk2-1.png', 'desk3-3.png', 'desk3-2.png'];

export default function Linux() {
    const [activeImage, setActiveImage] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    const increment = (n: number, inc: number) : number => {
        setImageLoading(true);
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
        <GlowBackdrop id='linux-ss-glow' deviation='20' saturation="20"/>
        <div className='linux'>
            <h2>
                Themes
            </h2>
            <p>
                Check out my custom desktop themes (Debian btw)<br/>
                <br/>
                I wrote a script and a SCSS template to generate a basic theme on the fly for the wallpaper, then add tweaks from there
            </p>
            <div className='image-display'>
                <div>
                    <input type='button' value='<' onClick={() => setActiveImage(a => increment(a, - 1))}/>
                    {activeImage+1} / {images.length} 
                    <input type='button' value='>' onClick={() => setActiveImage(a => increment(a, 1))}/>
                </div>
                <div className={imageLoading ? '' : 'loaded'}>
                    <div className='loader'/>
                </div>
                <a href={`./${images[activeImage]}`} 
                    hidden={imageLoading}
                    target='_blank' 
                    rel='noreferrer'>
                        <img src={`./${images[activeImage]}`} 
                            style={{filter: 'url(#linux-ss-glow)'}}
                            alt='desktop' 
                            className='large'
                            onLoad={() => setImageLoading(false)}/>
                </a>
            </div>
        </div>
    </Page>;
}