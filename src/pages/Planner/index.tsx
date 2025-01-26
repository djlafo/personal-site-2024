import { Page } from '../../components';

import usePlanner from './Planner';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskSaver from './TaskSaver';

import './planner.css';

export default function Planner() {
    const {tasks, addTask, removeTask, sort, setTasks} = usePlanner();

    return <Page>
        <div className='planner'>
            <h2>Daily Planner</h2>
            <TaskForm onSubmit={addTask}>
                {
                    (tasks.length > 1 && <input type='button' value='Sort' onClick={() => sort()}/>) || <></>
                }
                <TaskSaver tasks={tasks} onLoad={setTasks}/>
            </TaskForm>
            <TaskList tasks={tasks} onRemove={removeTask}/>
        </div>
    </Page>;
}