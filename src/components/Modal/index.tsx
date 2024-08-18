import React, { useState, useEffect } from 'react';
import './modal.css';

interface ModalProps {
    onClose: () => void;
    opened: boolean;
    children: JSX.Element | Array<JSX.Element>;
    styleOne?: boolean;
}

export default function Modal({ opened, children, onClose, styleOne=false } : ModalProps) {
    const [prevOpened, setPrevOpened] = useState(false);

    if((prevOpened !== opened)) {
        setPrevOpened(opened);
    }

    useEffect(() => {
		const onEsc = (e : KeyboardEvent) => {
			if(e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener('keydown', onEsc)
		return () => {
			window.removeEventListener('keydown', onEsc);
		}
	}, [onClose])

    return <div className={`modal-parent ${prevOpened ? 'opened' : ''}`}>
        <div className='modal-background' onClick={() => onClose()}></div>
        <div className={`modal-content ${styleOne ? 'style-one' : ''}`}>
            {children}
        </div>
    </div>;
};