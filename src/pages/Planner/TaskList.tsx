import { useState } from "react";
import { Task } from "./Planner";

interface TaskListProps {
    tasks : Array<Task>;
    onRemove : (t : Task) => void;
    onUpdate : (ta : Array<Task>) => void;
    children : React.ReactNode;
}
interface PartialTask {
    label ?: string;
    motivation ?: string;
    necessity ?: string;
}
interface StringTask {
    label : string;
    motivation : string;
    necessity : string;
    UUID: number;
}
export default function TaskList(props : TaskListProps) {
    const [lastTasks, setLastTasks] = useState<Array<Task>>();
    const [taskCopy, setTaskCopy] = useState<Array<StringTask>>();
    const [newID, setNewID] = useState(1);

    if(lastTasks !== props.tasks) {
        setLastTasks(props.tasks);
        setTaskCopy(props.tasks.map(t => {
            const translated : StringTask = {
                label: t.label,
                motivation: t.motivation.toString(),
                necessity: t.necessity.toString(),
                UUID: t.UUID
            };
            return translated;
        }));
    }

    const addRow = () => {
        props.onUpdate(props.tasks.concat([{
            UUID: newID,
            label: `Task ${props.tasks.length + 1}`,
            motivation: 0,
            necessity: 0
        }]));
        setNewID(n => n + 1);
    }

    const updateRow = (ind : number, pt : PartialTask) => {
        setTaskCopy(tc => {
            if(!tc) return [];
            const tcc = tc.slice();
            tcc.splice(ind, 1, Object.assign(tc[ind], pt));
            return tcc;
        });
    }

    const updateTasks = () => {
        if(!taskCopy) return;

        props.onUpdate(taskCopy.map(t => {
            const translated : Task = {
                label : t.label,
                motivation: Number(t.motivation),
                necessity: Number(t.necessity),
                UUID: t.UUID
            }
            return translated;
        }));
    }

    return <div className='task-list'>
        <div className='buttons'>
            <input type='button' value='Add' onClick={() => addRow()}/>
            {props.children}
        </div>
        {(props.tasks.length && 
            <table>
                <thead>
                    <th>
                        Label
                    </th>
                    <th>
                        Motivation
                    </th>
                    <th>
                        Necessity
                    </th>
                    <th></th>
                </thead>
                <tbody>
                    {taskCopy && taskCopy.map((t, i)=> {
                        return <tr key={t.UUID}>
                            <td>
                                <textarea rows='1'
                                    value={t.label} 
                                    onChange={e => updateRow(i, {label: e.target.value})}
                                    onBlur={() => updateTasks(i)}/>
                            </td>
                            <td>
                                <input type='number' 
                                    min='0'
                                    max='100'
                                    value={t.motivation} 
                                    onChange={e => updateRow(i, {motivation: e.target.value})}
                                    onBlur={() => updateTasks(i)}/>
                            </td>
                            <td>
                                <input type='number' 
                                    min='0'
                                    max='100'
                                    value={t.necessity} 
                                    onChange={e => updateRow(i, {necessity: e.target.value})}
                                    onBlur={() => updateTasks(i)}/>
                            </td>
                            <td>
                                <input type='button' value='X' onClick={() => props.onRemove(props.tasks[i])}/>
                            </td>
                        </tr>;
                    })}
                </tbody>
            </table>)
            || 
            <></>
        }
    </div>;
}