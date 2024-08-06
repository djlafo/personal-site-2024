class Timer {
    timerActive : boolean = false;
    timeArr : Array<number>;
    selectedRound : number;

    constructor(timeArr : Array<number>, selectedRound : number) {
        this.timeArr = timeArr;
        this.selectedRound = selectedRound;
    }
}

export default Timer;