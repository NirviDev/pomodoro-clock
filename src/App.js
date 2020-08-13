import React from "react";
import "./App.css";
import minionbido from "./minionbido.png";
import minionclock from "./minionclock.png";
import minioncontroller from "./minioncontroller.png";
import door from "./door.png";
import bidoAudio from "./minions-bido-bido-ringtone.mp3";
import "./digital-7.regular.ttf";
import "./Mignone.ttf";

const doorClosed = {
  position: "relative",
  height: "auto",
  width: "100%",
  maxWidth: "15.1vw",
  webkitTransform: "perspective(900) rotateY(0deg)",
  transition: "all 0.6s ease-in-out",
  transformOrigin: "0% 0%",
};

const doorOpened = {
  position: "relative",
  height: "auto",
  width: "100%",
  maxWidth: "15.1vw",
  webkitTransform: "perspective(900) rotateY(-110deg)",
  transition: "all 0.6s ease-in-out",
  transformOrigin: "0% 0%",
};

class Clock extends React.Component {
  render() {
    return (
      <div className="clock-body row">
        <div className="clock-label col-10">
          <div id="timer-label">{this.props.timerMode}</div>
          <div id="time-left">
            <span>{this.props.clockDisplay}</span>
          </div>
        </div>
        <div className="play-reset col-lg-2">
          <div className="row justify-content-center">
            <button className="btn col-6 col-lg-12" id="start_stop" onClick={this.props.play}>
              <i className={this.props.startStopStyle}></i>
            </button>
            <button className="btn col-6 col-lg-12" id="reset" onClick={this.props.reset}>
              <i className="fas fa-history fa-3x"></i>
            </button>
            <audio id="beep" src={bidoAudio} />
          </div>
        </div>
      </div>
    );
  }
}

class TimerController extends React.Component {
  render() {
    return (
      <div className="controller col-md-6 col-xl-12">
        <div className="row justify-content-center">
          <div id={this.props.titleID} className="col-12">
            {this.props.title}
          </div>
          <div className="row">
            <button
              id={this.props.decrementID}
              className="btn col"
              value="-"
              onClick={this.props.onClick}
            >
              <i className="fas fa-chevron-circle-down fa-3x"></i>
            </button>
            <div id={this.props.timeID} className="col">
              {this.props.time}
            </div>
            <button
              id={this.props.incrementID}
              className="btn col"
              value="+"
              onClick={this.props.onClick}
            >
              <i className="fas fa-chevron-circle-up fa-3x"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doorStyle: doorClosed,
      clickCount: 0,
      startStopStyle: "fas fa-play fa-3x",
      minutes: 25,
      seconds: 0,
      countDown: "",
      countDownSpeed: 200,
      play: false,
      firstPlay: true,
      reset: false,
      breakTime: 5,
      sessionTime: 25,
      timerMode: "Session",
    };
    this.doorOpen = this.doorOpen.bind(this);
    this.manualDoorToogle = this.manualDoorToogle.bind(this);
    this.manualDoorClose = this.manualDoorClose.bind(this);
    this.audioBido = new Audio(bidoAudio);
    this.reset = this.reset.bind(this);
    this.timePlay = this.timePlay.bind(this);
    this.setBreakTime = this.setBreakTime.bind(this);
    this.setSessionTime = this.setSessionTime.bind(this);
    this.clockDisplay = this.clockDisplay.bind(this);
  }

  doorOpen() {
    if (this.state.doorStyle === doorClosed) {
      this.setState({
        doorStyle: doorOpened,
      });
    } else {
      this.setState({
        doorStyle: doorClosed,
      });
    }
  }

  manualDoorToogle() {
    if (this.state.clickCount < 2) {
      this.doorOpen();
    } else if (this.state.doorStyle === doorOpened) {
      this.setState({
        doorStyle: doorClosed,
      });
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.manualDoorClose);
  }

  manualDoorClose() {
    if (this.state.clickCount < 3) {
      this.setState({
        clickCount: this.state.clickCount + 1,
      });
    } else {
      this.manualDoorToogle();
    }
  }

  reset() {
    clearInterval(this.state.countDown);
    clearTimeout();
    this.audioBido.pause();
    this.setState({
      doorStyle: doorClosed,
      startStopStyle: "fas fa-play fa-3x",
      minutes: 25,
      seconds: 0,
      countDown: "",
      play: false,
      firstPlay: true,
      reset: true,
      breakTime: 5,
      sessionTime: 25,
      timerMode: "Session",
    });
  }

  decrementTimer() {
    if (this.state.firstPlay) {
      this.setState({
        minutes: this.state.sessionTime,
        seconds: 0,
        firstPlay: false,
      });
    }
    if (this.state.seconds <= 10) {
      this.setState({
        minutes:
          this.state.seconds === 0
            ? this.state.minutes - 1
            : this.state.minutes,
        seconds: this.state.seconds === 0 ? 59 : this.state.seconds - 1,
      });
    } else {
      this.setState({
        seconds: this.state.seconds - 1,
      });
    }
    if (
      this.state.play &&
      this.state.minutes === 0 &&
      this.state.seconds === 0
    ) {
      if (this.state.timerMode === "Session") {
        this.setState({
          minutes: this.state.breakTime,
          seconds: 0,
          timerMode: "Break",
        });
        this.doorOpen();
        this.audioBido.currentTime = 0;
        this.audioBido.play();
        setTimeout(() => this.doorOpen(), 10000);
        setTimeout(() => this.audioBido.pause(), 10500);
      } else {
        this.setState({
          minutes: this.state.sessionTime,
          seconds: 0,
          timerMode: "Session",
        });
        this.doorOpen();
        this.audioBido.currentTime = 0;
        this.audioBido.play();
        setTimeout(() => this.doorOpen(), 10000);
        setTimeout(() => this.audioBido.pause(), 10500);
      }
    }
  }

  timePlay() {
    const { countDownSpeed } = this.state;
    this.setState({ reset: false });
    if (!this.state.play) {
      this.setState({
        countDown: setInterval(() => {
          this.decrementTimer();
        }, countDownSpeed),
        startStopStyle: "fas fa-pause fa-3x",
        play: true,
      });
    } else {
      clearInterval(this.state.countDown);
      this.audioBido.pause();
      this.setState({ startStopStyle: "fas fa-play fa-3x", play: false });
    }
  }

  setBreakTime(event) {
    let sign = event.currentTarget.value;
    if (!this.state.play && this.state.minutes > 0 && this.state.minutes < 61) {
      if (sign === "-") {
        this.setState({
          breakTime:
            this.state.breakTime === 1
              ? this.state.breakTime
              : this.state.breakTime - 1,
        });
      } else {
        this.setState({
          breakTime:
            this.state.breakTime === 60
              ? this.state.breakTime
              : this.state.breakTime + 1,
        });
      }
      if (this.state.timerMode === "Break") {
        setTimeout(
          () =>
            this.setState({
              minutes: this.state.breakTime,
            }),
          1
        );
      }
    }
  }

  setSessionTime(event) {
    const sign = event.currentTarget.value;
    if (
      !this.state.play &&
      this.state.minutes >= 1 &&
      this.state.minutes < 61
    ) {
      if (sign === "-") {
        this.setState({
          sessionTime:
            this.state.sessionTime === 1
              ? this.state.sessionTime
              : this.state.sessionTime - 1,
        });
      } else {
        this.setState({
          sessionTime:
            this.state.sessionTime === 60
              ? this.state.sessionTime
              : this.state.sessionTime + 1,
        });
      }
      if (this.state.timerMode === "Session") {
        setTimeout(
          () =>
            this.setState({
              minutes: this.state.sessionTime,
            }),
          1
        );
      }
    }
  }

  clockDisplay() {
    let displayMinutes =
      this.state.minutes < 10 ? "0" + this.state.minutes : this.state.minutes;
    let displaySeconds =
      this.state.seconds < 10 ? "0" + this.state.seconds : this.state.seconds;
    return displayMinutes + ":" + displaySeconds;
  }

  render() {
    return (
      <div className="pomodoro-clock container-fluid">
        <div className="wall">
          <p>Pomodoro Clock of Minions</p>
        </div>
        <div className="row">
          <div className="first-block col-3 col-xl-4">
            <div className="door-frame">
              <img className="minionbido img-responsive" src={minionbido} />
              <div className="shadow"></div>
              <img
                className="door"
                src={door}
                onClick={this.manualDoorToogle}
                style={this.state.doorStyle}
              />
            </div>
          </div>
          <div className="second-block col-4 col-lg-5 col-xl-4">
            <Clock
              timerMode={this.state.timerMode}
              startStopStyle={this.state.startStopStyle}
              clockDisplay={this.clockDisplay()}
              play={this.timePlay}
              pause={this.timePause}
              reset={this.reset}
            />
            <img className="minionclock" src={minionclock} />
          </div>
          <div className="third-block col-5 col-lg-4">
            <div className="controller-block row">
              <TimerController
                titleID="break-label"
                decrementID="break-decrement"
                incrementID="break-increment"
                timeID="break-length"
                title="Break Length"
                onClick={this.setBreakTime}
                time={this.state.breakTime}
              />
              <TimerController
                titleID="session-label"
                decrementID="session-decrement"
                incrementID="session-increment"
                timeID="session-length"
                title="Session Length"
                onClick={this.setSessionTime}
                time={this.state.sessionTime}
              />
            </div>
            <img className="minioncontroller" src={minioncontroller} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
