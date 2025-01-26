import { useRef, useState } from "react";

import { Task } from "./Planner";

interface TaskFormProps {
    onSubmit : (t : Task) => void;
    children : React.ReactNode;
}
export default function TaskForm(props : TaskFormProps) {
    const form = useRef<HTMLFormElement>(null);

    const [label, setLabel] = useState<string>('');
    const [motivation, setMotivation] = useState<string>('');
    const [necessity, setNecessity] = useState<string>('');

    const submitForm = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSubmit({
            label,
            motivation: Number(motivation),
            necessity: Number(necessity)
        });
        setLabel('');
        setMotivation('');
        setNecessity('');
    }

    return <form ref={form} onSubmit={submitForm}>
        <label htmlFor='task'>Label</label>
        <input id='task' 
            type='text' 
            required 
            value={label} 
            onChange={e => setLabel(e.target.value)}/>

        <label htmlFor='motivation'>Motivation</label>
        <input id='motivation' 
            type='number' 
            required 
            min='0' 
            max='100' 
            value={motivation} 
            onChange={e => setMotivation(e.target.value)}/>

        <label htmlFor='necessity'>Necessity</label>
        <input id='necessity' 
            type='number' 
            required 
            min='0' 
            max='100' 
            value={necessity} 
            onChange={e => setNecessity(e.target.value)}/>

        <div className='form-buttons'>
            <input type='submit' value='Add Task'/>
            {props.children}
        </div>
    </form>
}