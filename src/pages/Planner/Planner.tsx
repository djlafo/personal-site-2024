import { useState } from "react";

export interface Task {
    label : string;
    motivation: number;
    necessity: number;
    UUID: number;
}
interface UsePlannerReturn {
    tasks : Array<Task>;
    addTask : (t : Task) => void;
    removeTask : (t : Task) => void;
    sort : () => void;
    setTasks : (ta : Array<Task>) => void;
}
export default function usePlanner() {
    const [tasks, _setTasks] = useState<Array<Task>>([]);

    const addTask = (t : Task) => {
        _setTasks(ta => {
            return ta.concat([t]);
        });
    };

    const removeTask = (t : Task) => {
        _setTasks(ta => {
            const c = ta.slice();
            c.splice(ta.indexOf(t), 1);
            return c
        });
    };

    const sort = () => {
        _setTasks(ta => {
            const copy = ta.slice();
            return copy.sort((a, b) => {
                return b.motivation - a.motivation;
            });
        });
    }

    const setTasks = (ta : Array<Task>) => _setTasks(ta);

    const ret : UsePlannerReturn = {
        tasks, 
        addTask,
        removeTask,
        sort,
        setTasks
    };
    return ret;
}