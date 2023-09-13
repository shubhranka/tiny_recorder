window.onload = function () {
  // chrome.runtime.sendMessage({ command: "loaded" },(response) => {
  //   console.log(response);
  // });
  console.log("loaded");

  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   chrome.storage.session.set({ [tabs[0].id]: { loaded:true } });
  // });
};

const getStream = async () => {
  let userStream = null;
  let displayStream = null;



  if(data.screen || data.comAud)
    displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: data.screen,
      audio: data.comAud,
      preferCurrentTab: data.currentTab,
    });

  if(data.video || data.audio)
    userStream = await navigator.mediaDevices.getUserMedia({
      video: data.video,
      audio: data.audio,
    });

  const audioTracks = [
    ...(userStream?.getAudioTracks() || []),
    ...(displayStream?.getAudioTracks() || []),
  ];
  const videoTracks = [
    ...(userStream?.getVideoTracks() || []),
    ...(displayStream?.getVideoTracks() || []),
  ];

  return new MediaStream([...audioTracks, ...videoTracks]);
};

const getFileName = () => {
  var url = window.location.href;
  url = decodeURIComponent(decodeURIComponent(url));
  url = url.split("?")[0];
  url = url.replaceAll("-", " ");
  const paths = url.split("/");
  const fileName = paths[paths.length - 2] + " " + paths[paths.length - 1];
  return fileName;
};

const startRecording = async (data, fileName, sendResponse) => {

  try{

    const stream = await getStream();

    var recorder = new MediaRecorder(stream);
    data.recorder = recorder;

    // Record video chunks in a list
    var chunks = [];
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    // Save the video chunks as a blob
    recorder.onstop = (e) => {
      clearInterval(data.durationInterval);

      var blob = new Blob(chunks, { type: "video/webm" });
      var videoURL = window.URL.createObjectURL(blob);
      // document.getElementById('video').src = videoURL;

      // Download the video
      var a = document.createElement("a");

      // Set the video url
      a.href = videoURL;

      // Set the video file name
      a.download = `${fileName}.webm`;

      // Trigger the download by clicking the link
      a.click();
    };

    // Start recording
    recorder.start();

    // Create Interval 
    createInterval();

    // Send Response
    sendResponse({ message: "success" });
  }catch(err){
    console.log(err);
    sendResponse({ message: "error" });
    alert("Please Retry");
  }
};

const stopRecording = () => {
  data.recorder.stop();
  data.recorder = null;
  data.duration = 0;

  if (data.durationInterval) clearInterval(data.durationInterval);
};

const createInterval = () => {
  data.durationInterval = setInterval(() => {
    if (data.duration <= 0 && data.timed) {
      stopRecording();
      return;
    }
    if(data.timed)
      data.duration -= 1000;
    else
      data.duration += 1000;
  }, 1000);
};

let data = {
  screen: false,
  video:false,
  audio: false,
  comAud: false,
  mic: false,
  timed: false,
  currentTab: false,
  duration: 0,
  pause: false,
  recorder: null,
  durationInterval: null,
  
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request, data);

  if (request.command === "start_recording") {
    const fileName = getFileName();
    data = { ...request.data };
    
    const config = {};
  
    startRecording(data, fileName,sendResponse);
    

    // startSendingState(request.duration, request.tabId);
  }

  if (request.command === "loaded") {
    sendResponse({ message: "success", data });
  }

  if (request.command === "pause_recording") {
    console.log("pause");
    data.pause = true;
    data.recorder.pause();
    clearInterval(data.durationInterval);
    sendResponse({ message: "success" });
  }

  if (request.command === "resume_recording") {
    data.pause = false;
    data.recorder.resume();

    createInterval();
    sendResponse({ message: "success" });
  }

  if (request.command === "stop_recording") {
    stopRecording();
    sendResponse({ message: "success" });
  }

  //   // if (request.command === "start_recording_by_file") {

  //   //   const {duration,timed,screen,audio,comAud,mic} = request

  //   //   startRecording(request.durationString,myRecorder);
  //   //   sendResponse({ message: "success" });
  //   // }

  //   // if (request.command === "stop_recording_by_file") {
  //   //   myRecorder[0].stop()
  //   //   myRecorder[0] = null
  //   //   sendResponse({ message: "success" });
  //   // }

  //   // if (request.command === "pause_recording_by_file") {
  //   //   myRecorder[0].pause()
  //   //   sendResponse({ message: "success" });
  //   // }

  //   // if (request.command === "resume_recording_by_file") {
  //   //   myRecorder[0].resume()
  //   //   sendResponse({ message: "success" });
  //   // }
});
