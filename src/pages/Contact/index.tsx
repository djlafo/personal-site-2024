import React from 'react';
import Page from '../../components/Page';
import './contact.css';

function Contact() {
    return <Page>
        <div className='contact'>
            <p>
                <label>E-mail</label>&nbsp;
                <a href='mailto:djlafo@gmail.com'>djlafo@gmail.com</a>
            </p>
            <p>
                <a href='https://github.com/djlafo' target="_blank" rel="noreferrer">github.com/djlafo</a>
            </p>
            <p>
                <a href="https://www.linkedin.com/in/dylan-lafont-99a58a150/" target="_blank" rel="noreferrer">LinkedIn</a>
            </p>
        </div>
    </Page>;
}

export default Contact;