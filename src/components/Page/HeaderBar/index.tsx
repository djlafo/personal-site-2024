import React, { useState } from 'react';
import './headerbar.css';
import { Link } from 'react-router-dom';
import { Modal } from '../../';
import { openOnEscFn } from '../../Modal';

function HeaderBar() {
	const [open, setOpen] = useState(false);

    return <div className='header-bar'>
			<div className='burger-menu' onClick={() => setOpen(true)}>
				<div className='burger-bar'/>
				<div className='burger-bar'/>
				<div className='burger-bar'/>
			</div>
			
			<Modal opened={open} onClose={() => setOpen(false)} doOnKey={openOnEscFn(() => setOpen(true))}>
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
					<span>
						<Link to={'/Visualizer'}>
							Music Visualizer
						</Link>
					</span>
					<span>
						<Link to={'/Planner'}>
							Daily Planner
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
			</Modal>

		</div>;
}

export default HeaderBar;
