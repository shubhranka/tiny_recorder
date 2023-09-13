const form = document.querySelector("form");
let tabId = null;

let state = {
  screen: false,
  audio: false,
  video: false,
  comAud: false,
  mic: false,
  timed: false,
  currentTab: false,
  duration: 0,
  pause: false,
  recorder: null,
  durationInterval: null,
}

const convertToMiliseconds = (hour, min, sec) => {
  return (hour * 3600 + min * 60 + sec) * 1000 + 5000;
};

const convertToTimeString = (duration) => {
  duration = Math.floor(duration / 1000);
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = Math.floor(duration - hours * 3600 - minutes * 60);

  return `${hours}:${minutes}:${seconds}`;
}

const updateTimeInterval = ()=>{

  const interval = setInterval(()=>{

    if(state.pause){
      clearInterval(interval);  
      return;
    }

    if(state.timed){
      state.duration -= 1000;
    }else{
      state.duration += 1000;
    }
    recording_time.innerHTML = convertToTimeString(state.duration);

    if(state.duration <= 0){
      clearInterval(interval);
      isRecording = false;
    }
  },1000)

  state.interval = interval;
}

const swapView = ()=>{
    started.style.display = "none";
    recording.style.display = "block";
    recording_time.innerHTML = convertToTimeString(state.duration);
    if(!state.pause){
      updateTimeInterval();
    }else{
      pause.innerHTML = "Resume ▶️";
    }
}

const sendStartCommand = async () =>{
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const response = await chrome.tabs.sendMessage(tabs[0].id, {
        command: "start_recording",
        data: state,
      });

      if (response.message === "success") {
        console.log("success");
        swapView();
      }
    } catch (err) {
      console.log(err);
    }
    console.log("hello called");
}

form.onsubmit = function (event) {
  event.preventDefault();
  const hours = Number(form.hours.value) || 0;
  const minutes = Number(form.minutes.value) || 0;
  const seconds = Number(form.seconds.value) || 0;
  const duration = convertToMiliseconds(hours, minutes, seconds);
  state.duration = duration;
  state.timed = true;

  sendStartCommand();
};

const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  if (button.id !== "timed") {
    button.onclick = function () {
      button.classList.toggle("active");
      if (button.classList.contains("active")) {
        state[button.id] = true;
      } else {
        state[button.id] = false;
      }
    };
  }
});

timed.addEventListener("click", function () {
  timed.classList.toggle("active");
  if (timed.classList.contains("active")) {
    form.style.display = "block";
    form.style.height = "auto";
    record.style.display = "none"
    state["timed"] = true;
  } else {
    form.style.display = "none";
    form.style.height = "0px";
    record.style.display = "block"
    state["timed"] = false;
  }
});


document.addEventListener("DOMContentLoaded", ()=>{
  const interval = setInterval(async () => {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const response = await chrome.tabs.sendMessage(tabs[0].id, {
        command: "loaded",
      });
      if (response.message === "success") {
        clearInterval(interval);
        console.log("success");
        
        content.classList.remove("hidden");
        loader.classList.add("hidden");
        loader.style.display = "none";
        document.body.style.height = "auto";

        if(response.data?.recorder){
          console.log("recorder exists");
          state = {...response.data};
          swapView();
        }
      }
    } catch (err) {
      console.log(err);
    }
  },500);
})

// When close window clear all intervals
window.addEventListener("beforeunload", function (event) {
  this.clearInterval(state.interval);
})


pause.addEventListener("click", ()=>{
  const command = state.pause ? "resume_recording" : "pause_recording";
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {command}, (response)=>{
      if(response.message === "success"){
        if(!state.pause){
        state.pause = true;
        pause.innerHTML = "Resume ▶️";
        }else{
          state.pause = false;
          pause.innerHTML = "Pause ⏸️";
          updateTimeInterval();
        }
      }
    });
  });
});

stopRec.addEventListener("click", ()=>{
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {command: "stop_recording"}, (response)=>{
      if(response.message === "success"){
        console.log("success");
        isRecording = false;
        started.style.display = "block";
        recording.style.display = "none";
        clearInterval(state.interval);
      }
    });
  });
});

record.addEventListener("click", ()=>{
  sendStartCommand();
})