import React from 'react';
import './index.css';
import moment from 'moment';

class Goals extends React.Component {
  constructor(props){
    super(props);

    const fromMoment = moment([2020, 0]);
    const daysthisYear = moment([2021, 0]).diff(fromMoment, 'days');
    const daysPassed = moment().diff(fromMoment, 'days');

    this.state = {
      endGoal: 3000, 
      currentAverage: 2400,
      daysthisYear,
      daysPassed, fromMoment, walks: []
    }
  }

  inputField = (e) => {
    const meters = Math.round(e.target.value);

    switch (e.target.name) {
      case 'endGoal':
      case 'currentAverage':
        this.setState({[e.target.name]: meters});
        localStorage.setItem(`walkative.${e.target.name}`, meters);
        break;
      default:
        const date = e.target.name;
        const walk = {date, meters};
        
        const { walks } = this.state;
        const curr = walks.find(({date}) => walk.date === date);
        if (curr) {
          curr.meters = walk.meters;
        } else {
          walks.push(walk);
    
        }
    
        this.setState({walks});
        localStorage.setItem(`walkative.walks`, JSON.stringify(walks));
        break;
    }
    this.props.update();
  }

  componentDidMount(nextProps) {
    for(var i =0; i < localStorage.length; i++){
      const currentKey = localStorage.key(i);
      if(currentKey.includes('walkative.')) {
        this.setState({[currentKey.split('walkative.').pop()]: JSON.parse(localStorage.getItem(currentKey))});
      }

    }
  }

 fullwalks = () => {
    const walksfull = [];

    const { fromMoment, daysPassed, currentAverage, walks = [] } = this.state;
    const makeDay = fromMoment.clone();

    for (let day = 0; day < daysPassed; day++) {
        const momentDay = makeDay.format('Y-MM-DD');
        const curr = walks.find(({date}) => momentDay === date);
        const push = { date: momentDay, meters: curr ? curr.meters : currentAverage, auto: !curr}
        walksfull.push(push);
        makeDay.add(1, 'd');
    }

    return walksfull;
}

dayOfWalk = () => {
  const walks = this.fullwalks();
  return walks.reverse().map(walk =>(
    <div className="dayofWalk" style={{fontStyle: walk.auto ? 'italic' : ''}}> 
      <span>{walk.date}</span>
      <input name={walk.date} onChange={this.inputField} value={walk.meters} type="number" pattern="[0-9]*" />
    </div>
  ));
}


  render() {
    return (
        <div className={`goals ${this.props.open ? 'open': ''}`}>
          <div>
            <span>Meters per day</span>
            <input name={'endGoal'} onChange={this.inputField} value={this.state.endGoal} type="number" pattern="[0-9]*" />
          </div>
          <div>
            <span>Default average</span>
            <input name={'currentAverage'} onChange={this.inputField} value={this.state.currentAverage} type="number" pattern="[0-9]*" />
          </div>
          <hr></hr>
          {this.dayOfWalk()}
        </div>
    );
  }
}
export default Goals;
