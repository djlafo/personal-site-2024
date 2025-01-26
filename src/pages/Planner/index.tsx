import { Page } from '../../components';

import usePlanner from './Planner';
import TaskList from './TaskList';
import TaskSaver from './TaskSaver';

import './planner.css';

export default function Planner() {
    const {tasks, removeTask, sort, setTasks} = usePlanner();

    return <Page>
        <div className='planner'>
            <h2>Daily Planner</h2>
            <TaskList tasks={tasks} onRemove={removeTask} onUpdate={setTasks}>
                {
                    (tasks.length > 1 && <input type='button' value='Sort' onClick={() => sort()}/>) || <></>
                }
                <TaskSaver tasks={tasks} onLoad={setTasks}/>
            </TaskList>
        </div>
    </Page>;
}