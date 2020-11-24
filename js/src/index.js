class CalendarYearMonthPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="calendar-year-panel">
                <div>{this.props.year}-{this.props.month.toString().padStart(2, 0)}</div>
                <div>
                    <button type="button" onClick={this.props.monthDecrease}>&lt;</button>
                    <button type="button" onClick={this.props.monthIncrease}>&gt;</button>
                </div>
            </div>
        );
    }
}

class CalendarDayPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    static getDaysInMonth(year, month) {
        if (month < 0) {
            year--;
            month = 11;
        } else if (month >= 12) {
            year++;
            month = 0;
        }
        return new Date(year, month, 0).getDate();
    }

    static getMonthFirstDayWeekday(year, month) {
        return new Date(year, month - 1, 1).getDay(); // Sun = 0, Sat = 6
    }

    static getDatesBeforeMonth(year, month) {
        const days = this.getMonthFirstDayWeekday(year, month);
        if (days <= 0) {
            return [];
        }
        let dates = [];
        for (let i = 0, date = this.getDaysInMonth(year, month - 1) - (days - 1); i < days; i++, date++) {
            dates.push(date);
        }
        return dates;
    }

    getDateOffset(date, monthOffset) {
        let year = this.props.year;
        let month = this.props.month + monthOffset;
        if (month < 1) {
            year--;
            month = 12;
        } else if (month > 12) {
            year++;
            month = 1;
        }
        return {
            year: year,
            month: month,
            date: date
        };
    }

    static getFullDateString(fullDate) {
        return fullDate.year + '-' + fullDate.month.toString().padStart(2, 0) + '-' + fullDate.date.toString().padStart(2, 0);
    }

    static isToday(year, month, date) {
        const now = new Date();
        return now.getFullYear() == year && now.getMonth() == month - 1 && now.getDate() == date;
    }

    isSelected(year, month, date) {
        return year == this.props.selectedYear && month == this.props.selectedMonth && date == this.props.selectedDate;
    }

    render() {
        const datesBeforeMonth = this.constructor.getDatesBeforeMonth(this.props.year, this.props.month);
        let dates = [];
        for (let i = 0, l = this.constructor.getDaysInMonth(this.props.year, this.props.month); i < l; i++) {
            dates.push(i + 1);
        }
        let datesAfterMonth = [];
        for (let i = 0; (datesBeforeMonth.length + dates.length + i) % 7 !== 0; i++) {
            datesAfterMonth.push(i + 1);
        }
        return (
            <div className="calendar-day-panel">
                <div className="week">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                </div>
                <div className="days">
                    {datesBeforeMonth.map((date) => {
                        const fullDate = this.getDateOffset(date, -1);
                        return <div key={this.constructor.getFullDateString(fullDate)}><a onClick={() => this.props.onDateClick(fullDate.year, fullDate.month, fullDate.date)} className={classNames('date', 'before-month', { 'is-selected': this.isSelected(fullDate.year, fullDate.month, fullDate.date) })}>{date}</a></div>
                    })}
                    {dates.map((date) => {
                        const fullDate = this.getDateOffset(date, 0);
                        return <div key={this.constructor.getFullDateString(fullDate)}><a onClick={() => this.props.onDateClick(fullDate.year, fullDate.month, fullDate.date)} className={classNames('date', { 'today': this.constructor.isToday(this.props.year, this.props.month, date), 'is-selected': this.isSelected(fullDate.year, fullDate.month, fullDate.date) })} > {date}</a></div>
                    })}
                    {datesAfterMonth.map((date) => {
                        const fullDate = this.getDateOffset(date, 1);
                        return <div key={this.constructor.getFullDateString(fullDate)}><a onClick={() => this.props.onDateClick(fullDate.year, fullDate.month, fullDate.date)} className={classNames('date', 'after-month', { 'is-selected': this.isSelected(fullDate.year, fullDate.month, fullDate.date) })}>{date}</a></div>
                    })}
                </div>
            </div>
        );
    }
}

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.goToYearMonth = this.goToYearMonth.bind(this);
        this.monthIncrease = this.monthIncrease.bind(this);
        this.monthDecrease = this.monthDecrease.bind(this);
        this.onDateClick = this.onDateClick.bind(this);
        this.state = {
            year: this.props.year,
            month: this.props.month,
            selectedYear: this.props.selectedYear,
            selectedMonth: this.props.selectedMonth,
            selectedDate: this.props.selectedDate
        };
    }

    goToYearMonth(year, month) {
        this.setState({
            year: year,
            month: month
        });
    }

    monthIncrease() {
        let month = this.state.month;
        month++;
        if (month > 12) {
            this.setState({
                year: this.state.year + 1,
                month: 1
            });
        } else {
            this.setState({
                month: month
            });
        }
    }

    monthDecrease() {
        let month = this.state.month;
        month--;
        if (month < 1) {
            this.setState({
                year: this.state.year - 1,
                month: 12
            });
        } else {
            this.setState({
                month: month
            });
        }
    }

    onDateClick(year, month, date) {
        this.setState({
            selectedYear: year,
            selectedMonth: month,
            selectedDate: date
        });
        this.props.onDateSelected(year, month, date);
    }

    render() {
        return (
            <div className="calendar">
                <CalendarYearMonthPanel year={this.state.year} month={this.state.month} monthIncrease={this.monthIncrease} monthDecrease={this.monthDecrease} />
                <CalendarDayPanel year={this.state.year} month={this.state.month} onDateClick={this.onDateClick} selectedYear={this.state.selectedYear} selectedMonth={this.state.selectedMonth} selectedDate={this.state.selectedDate} />
            </div>
        );
    }
}

//

class EventPanelTimeBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let times = [];
        for (let i = 0; i < 24; i++) {
            times.push(<div key={i} onClick={() => this.props.onTimeBarClick(i.toString().padStart(2, 0) + ':00')}>{i.toString().padStart(2, 0) + ':00'}</div>);
            times.push(<div key={i + 0.5} onClick={() => this.props.onTimeBarClick(i.toString().padStart(2, 0) + ':30')}>{i.toString().padStart(2, 0) + ':30'}</div>);
        }
        return (
            <div className="event-panel-time-bar">
                {times}
            </div>
        );
    }
}

class EventDialog extends React.Component {
    static Types = {
        NEW: 'New',
        EDIT: 'Edit'
    };

    constructor(props) {
        super(props);
        this.showNew = this.showNew.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.close = this.close.bind(this);
        this.onInputsChange = this.onInputsChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.state = {
            isShowing: false,
            event: null,
            startTime: '',
            endTime: '',
            title: ''
        };
    }

    showNew(time = null) {
        this.setState({
            type: this.constructor.Types.NEW,
            isShowing: true,
            startTime: time !== null ? time : '',
            endTime: '',
            title: ''
        });
        $('#dialogs').addClass('showing');
    }

    showEdit(event) {
        this.setState({
            type: this.constructor.Types.EDIT,
            isShowing: true,
            event: event,
            startTime: event.startTime,
            endTime: event.endTime,
            title: event.title
        });
        $('#dialogs').addClass('showing');
    }

    close() {
        this.setState({
            isShowing: false
        });
        $('#dialogs').removeClass('showing');
    }

    onInputsChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }

    onSubmit(e) {
        if (this.state.startTime == '' || this.state.endTime == '' || this.state.title == '') {
            alert('Please enter all the fields');
            e.preventDefault();
            return;
        }
        if (EventCalendarEvent.timeToNumber(this.state.endTime) <= EventCalendarEvent.timeToNumber(this.state.startTime)) {
            alert('End Time must be later than Start Time');
            e.preventDefault();
            return;
        }
        let data = {
            type: this.state.type,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            title: this.state.title
        };
        if (this.state.type === this.constructor.Types.EDIT) {
            data.event = this.state.event;
        }
        this.props.onSubmit(data);
        this.close();
        e.preventDefault();
    }

    onRemove() {
        this.props.onRemove(this.state.event);
        this.close();
    }

    render() {
        return (
            <div id="event-dialog" className={classNames('dialog', { 'showing': this.state.isShowing })}>
                <a className="button-close" onClick={this.close}>X</a>
                <div className="title">{this.state.type} Event</div>
                <form onSubmit={this.onSubmit}>
                    <label><div>Title</div><input type="text" name="title" value={this.state.title} onChange={this.onInputsChange} required /></label>
                    <label><div>Start Time</div><input type="time" name="startTime" value={this.state.startTime} onChange={this.onInputsChange} required /></label>
                    <label><div>End Time</div><input type="time" name="endTime" value={this.state.endTime} onChange={this.onInputsChange} required /></label>
                    <input type="submit" value="Submit" />
                    {this.state.type === this.constructor.Types.EDIT &&
                        <input type="button" value="Remove" onClick={this.onRemove} />
                    }
                </form>
            </div>
        );
    }
}

class EventPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    useSlot(usedSlots, startTime, endTime) {
        let columnIndex = 0;
        for (columnLength = usedSlots.length; columnIndex < columnLength; columnIndex++) {
            const column = usedSlots[columnIndex];
            let isBlocked = false;
            for (let i = 0, l = column.length; i < l; i++) {
                const usedSlot = column[i];
                if ((startTime <= usedSlot.startTime && endTime > usedSlot.startTime) || (startTime >= usedSlot.startTime && startTime < usedSlot.endTime) /*(startTime < usedSlot.endTime && endTime >= usedSlot.endTime)*/) {
                    isBlocked = true;
                    break;
                }
            }
            if (!isBlocked) {
                break;
            }
        }
        const slot = {
            startTime: startTime,
            endTime: endTime
        };
        if (columnIndex < usedSlots.length) {
            usedSlots[columnIndex].push(slot);
        } else {
            usedSlots.push([slot]);
        }
        return columnIndex;
    }

    render() {
        let events = [];
        let usedSlots = [];
        for (let i = 0, l = this.props.events.length; i < l; i++) {
            const event = this.props.events[i];
            const columnIndex = this.useSlot(usedSlots, EventCalendarEvent.timeToNumber(event.startTime), EventCalendarEvent.timeToNumber(event.endTime));
            events.push(<div key={event.getHashCode()} className="event" style={{ top: EventCalendarEvent.timeToNumber(event.startTime) / 24 * 100 + '%', left: columnIndex * 20 + '%', height: event.getDuration() / 24 * 100 + '%' }} onClick={() => this.props.onEventClick(event)}>{event.title}</div>);
        }
        return (
            <div className="event-panel">
                <EventPanelTimeBar onTimeBarClick={this.props.onTimeBarClick} />
                <div className="event-panel-events-padding">
                    <div className="event-panel-events">
                        {events}
                    </div>
                </div>
            </div>
        );
    }
}

class EventCalendarEvent {
    constructor(year, month, date, startTime, endTime, title) {
        this.year = year;
        this.month = month;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.title = title;
    }

    getDuration() {
        return this.constructor.timeToNumber(this.endTime) - this.constructor.timeToNumber(this.startTime);
    }

    static timeToNumber(time) {
        const parts = time.split(':');
        return parseInt(parts[0]) + parseFloat(parts[1]) / 60;
    }

    static numberToTime(number) {
        return Math.floor(number) + ':' + (number % 1 * 60);
    }

    getHashCode() {
        return this.startTime + '|' + this.endTime + '|' + this.title;
    }
}

class EventCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.showNewEventDialog = this.showNewEventDialog.bind(this);
        this.showEditEventDialog = this.showEditEventDialog.bind(this);
        this.onSubmitEventDialog = this.onSubmitEventDialog.bind(this);
        this.onRemoveEventDialog = this.onRemoveEventDialog.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
        ReactDOM.render(<EventDialog ref={(component) => this.eventDialog = component} onSubmit={this.onSubmitEventDialog} onRemove={this.onRemoveEventDialog} />, document.getElementById('dialogs'));
        const now = new Date();
        this.state = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            date: now.getDate(),
            events: [
                new EventCalendarEvent(now.getFullYear(), now.getMonth() + 1, now.getDate(), "00:00", "01:00", "Navigate Calendar and choose a date"),
                new EventCalendarEvent(now.getFullYear(), now.getMonth() + 1, now.getDate(), "00:30", "03:00", "Create new event: Click on timeline empty space"),
                new EventCalendarEvent(now.getFullYear(), now.getMonth() + 1, now.getDate(), "01:00", "02:45", "Edit existing event: Click on existing event"),
            ]
        }
    }

    showNewEventDialog(time = null) {
        this.eventDialog.showNew(time);
    }

    showEditEventDialog(event) {
        this.eventDialog.showEdit(event);
    }

    onSubmitEventDialog(data) {
        switch (data.type) {
            case EventDialog.Types.NEW:
                this.setState({
                    events: this.state.events.concat([new EventCalendarEvent(this.state.year, this.state.month, this.state.date, data.startTime, data.endTime, data.title)])
                });
                break;
            case EventDialog.Types.EDIT:
                data.event.startTime = data.startTime;
                data.event.endTime = data.endTime;
                data.event.title = data.title;
                this.forceUpdate();
                break;
        }
    }

    onRemoveEventDialog(event) {
        const events = this.state.events.slice();
        const removeIndex = events.indexOf(event);
        events.splice(removeIndex, 1);
        this.setState({
            events: events
        });
    }

    onDateSelected(year, month, date) {
        this.setState({
            year: year,
            month: month,
            date: date
        });
    }

    render() {
        return (
            <div className="event-calendar">
                <Calendar year={this.state.year} month={this.state.month} selectedYear={this.state.year} selectedMonth={this.state.month} selectedDate={this.state.date} onDateSelected={this.onDateSelected} />
                <EventPanel year={this.state.year} month={this.month} date={this.state.date} events={this.state.events.filter(event => event.year == this.state.year && event.month == this.state.month && event.date == this.state.date)} onTimeBarClick={(time) => this.showNewEventDialog(time)} onEventClick={(event) => this.showEditEventDialog(event)} />
            </div>
        )
    }
}