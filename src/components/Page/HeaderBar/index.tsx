import React, { useState, useEffect } from 'react';
import './headerbar.css';
import { Link } from 'react-router-dom';

function HeaderBar() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const onEsc = (e : KeyboardEvent) => {
			if(e.key === "Escape") {
				setOpen(o => !o);
			}
		};

		window.addEventListener('keydown', onEsc)
		return () => {
			window.removeEventListener('keydown', onEsc);
		}
	}, [setOpen])

    return <>
		<div className={`header-bar ${open ? 'opened' : ''}`}>

			<div className='burger-menu' onClick={() => setOpen(true)}>
				<div className='burger-bar'/>
				<div className='burger-bar'/>
				<div className='burger-bar'/>
			</div>
			
			<nav className='link-list' onClick={() => setOpen(false)}>
				<span>
					<Link to={'/'}>
						Home
					</Link>
				</span>
				<span>
					<Link to={'/Linux'}>
						Linux Stuff
					</Link>
				</span>
				<span>
					<Link to={'/Interval'}>
						Interval Timer
					</Link>
				</span>
				<span>
					<Link to={'/Weather'}>
						Weather
					</Link>
				</span>
				<div className='link-divider'/>
				<span>
					<a href='mailto:djlafo@gmail.com'>djlafo@gmail.com</a>
				</span>
				<span>
					<a href='https://github.com/djlafo' target="_blank" rel="noreferrer">github.com/djlafo</a>
				</span>
				<span>
					<a href="https://www.linkedin.com/in/dylan-lafont-99a58a150/" target="_blank" rel="noreferrer">LinkedIn</a>
				</span>
			</nav>

		</div>
	</>;
}

export default HeaderBar;
