import React from 'react';
import logo from '../../../logo.svg';
import './headerbar.css';
import { Link } from 'react-router-dom';

function HeaderBar() {
    return <div className='header-bar'>
	<Link to="/">
	    <img src={logo} alt='React Logo'/>
	</Link>	
	<nav className='link-list'>
	    <span>
			<Link to={'/'}>
				Home
			</Link>
	    </span>
		<span>
			<Link to={'/Contact'}>
				Info
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
	</nav>
	<div className='counter-div'></div>
    </div>;
}

export default HeaderBar;
