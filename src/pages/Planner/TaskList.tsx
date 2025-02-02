import { useEffect, useState } from "react";
import { Task } from "./Planner";

import { TimeInput } from '../../components';

const TEXTAREA_PADDING = 5;

interface TaskListProps {
    tasks : Array<Task>;
    onRemove : (t : Task) => void;
    onUpdate : (ta : Array<Task>) => void;
    children : React.ReactNode;
}
interface StringTask extends Omit<Task, 'motivation' | 'necessity'> {
    motivation : string;
    necessity : string;
}
export default function TaskList(props : TaskListProps) {
    const [lastTasks, setLastTasks] = useState<Array<Task>>();
    const [taskCopy, setTaskCopy] = useState<Array<StringTask>>();
    const [newID, setNewID] = useState(1);

    if(lastTasks !== props.tasks) {
        setLastTasks(props.tasks);
        let counter = 1;
        setTaskCopy(props.tasks.map(t => {
            let deadline = t.deadline;
            if(deadline)  {
                deadline -= Date.now();
                deadline = Math.floor(deadline/1000);
                if(deadline < 0) deadline = 0;
            }
            const translated : StringTask = {
                label: t.label || '',
                motivation: t.motivation.toString() || '0',
                UUID: counter,
                done: t.done || false,
                deadline: deadline
            };
            counter++;
            return translated;
        }));
        setNewID(counter);
    }

    const addRow = () => {
        props.onUpdate(props.tasks.concat([{
            UUID: newID,
            label: '',
            motivation: 0,
            done: false,
            deadline: 0
        }]));
        setNewID(n => n + 1);
    }

    const updateRow = (ind : number, pt : Partial<StringTask>, immediate=false) => {
        if(!taskCopy) return;
        const tcc = taskCopy.slice();
        tcc.splice(ind, 1, Object.assign(taskCopy[ind], pt));
        if(immediate) {
            updateTasks(tcc);
        } else {
            setTaskCopy(tcc);
        }
    }

    const anyChecked = () => {
        if(!taskCopy) return false;
        return taskCopy.some(t => t.done);
    }

    const checkAll = (checked : boolean) => {
        if(!taskCopy) return;
        const tcc = taskCopy.slice();
        tcc.map(t => {
            return Object.assign(t, {done: checked});
        });
        updateTasks(tcc);
    }

    const updateTasks = (tasks = taskCopy) => {
        if(!tasks) return;

        props.onUpdate(tasks.map(t => {
            const translated : Task = {
                label : t.label,
                motivation: Number(t.motivation),
                UUID: t.UUID,
                done: t.done,
                deadline: t.deadline ? Date.now() + (t.deadline * 1000) : 0
            }
            return translated;
        }));
    }

    // hack to resize on initial load, i apologize for this
    useEffect(() => {
        setTimeout(() => {
            document.querySelectorAll("textarea").forEach(textarea => {
                textarea.style.height = 'auto'
                textarea.style.height = textarea.scrollHeight + TEXTAREA_PADDING + "px";
            });
        }, 50);
    }, [taskCopy]);

    return <div className='task-list'>
        <div className='buttons'>
            {(taskCopy && taskCopy.length && <>
                <span>
                    <input id='allCheck' 
                        type='checkbox'
                        checked={anyChecked()}
                        onChange={e => checkAll(e.target.checked)}/>
                    <label htmlFor='allCheck'>All</label>
                </span>
            </>) || <></>}
            {props.children}
        </div>
        {(taskCopy && taskCopy.length && 
            <div className='task'>
                {taskCopy.map((t, i)=> {
                    return <div key={t.UUID} className={`task-cell ${t.done ? 'done' : ''}`}>        
                        <textarea rows={1}
                            autoFocus={i === taskCopy.length - 1}
                            value={t.label} 
                            onChange={e => {
                                updateRow(i, {label: e.target.value});
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight + TEXTAREA_PADDING}px`;
                            }}
                            onBlur={() => updateTasks()}/>
                        <div className='task-details'>
                            <div>
                                <input type='number' 
                                    min='0'
                                    max='100'
                                    value={t.motivation} 
                                    onChange={e => updateRow(i, {motivation: e.target.value})}
                                    onBlur={() => updateTasks()}/>
                                <br/>
                                <TimeInput value={t.deadline} 
                                    onValueChange={n => updateRow(i, {deadline: n}, true)}/>
                            </div>
                            <div>
                                <input type='checkbox'
                                    checked={t.done}
                                    onChange={e => {
                                        updateRow(i, {done: !t.done}, true);
                                    }}/>
                                <input type='button' value='x' onClick={() => props.onRemove(props.tasks[i])}/>
                            </div>
                        </div>
                    </div>;
                })}
            </div>)
            || 
            <></>
        }
        <input type='button' value='Add' onClick={() => addRow()}/>
    </div>;
}