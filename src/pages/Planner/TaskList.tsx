import { Task } from "./Planner";

interface TaskListProps {
    tasks : Array<Task>;
    onRemove : (t : Task) => void;
}
export default function TaskList(props : TaskListProps) {
    return <div className='task-list'>
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
                    {props.tasks.map(t => {
                        return <tr key={`${t.label}-${t.motivation}-${t.necessity}`}>
                            <td>
                                {t.label}
                            </td>
                            <td>
                                {t.motivation}
                            </td>
                            <td>
                                {t.necessity}
                            </td>
                            <td>
                                <input type='button' value='X' onClick={() => props.onRemove(t)}/>
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