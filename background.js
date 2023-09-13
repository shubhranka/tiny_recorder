// chrome.commands.onCommand.addListener(function (command) {
//   if(command === "Ctrl+M")
//   chrome.runtime.reload();
// });

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    code: `console.log("hello world")`,
  })
  console.log(tab)
});


console.log("hello")
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if(request.command === "show_time") {
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             if (tabs[0].id === request.tabId) {
//                 chrome.tabs.sendMessage(
//                     tabs[0].id,
//                     { command: "show_time_main", time: new Date().toLocaleTimeString() },
//                     function (response) {
//                         if (response.message === "success") {
//                             console.log("success");
//                         }
//                     }
//                 );
//             }
//         });

//         sendResponse({ message: "success" });
//     }

//     if(request.command === "start_recording") {

//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//           console.log(tabs, request);
//             if (tabs[0].id === request.tabId) {
//                 chrome.tabs.sendMessage(
//                     tabs[0].id,
//                     { command: "start_recording_by_file", durationString: request.durationString, tabId: tabs[0].id },
//                     function (response) {
//                         if (response.message === "success") {
//                             console.log("success");
//                         }
//                     }
//                 );

//               }
//             });
//             sendResponse({ message: "success" });
//     }
// })


// // const payload = "payload";

// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //   const command = request.command;
// //   if (command === "start_recording") {
// //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
// //       console.log(tabs);
// //       if(tabs.length === 0)
// //       return;
// //       chrome.scripting.executeScript({
// //         target: { tabId: tabs[0].id },
// //         function: (request) => {
// //           const convertToMiliseconds = (hour, min, sec) => {
// //             return (hour * 3600 + min * 60 + sec) * 1000 + 5000;
// //           };

// //           const startRecording = (durationString) => {
// //             try {
// //               const durationArray = durationString.split(":");
// //               const hour = parseInt(durationArray[0]);
// //               const min = parseInt(durationArray[1]);
// //               const sec = parseInt(durationArray[2]);

// //               const duration = convertToMiliseconds(hour, min, sec);

// //               var url = window.location.href;
// //               url = decodeURIComponent(decodeURIComponent(url));
// //               url = url.split("?")[0];
// //               url = url.replaceAll("-", " ");
// //               const paths = url.split("/");
// //               const fileName =
// //                 paths[paths.length - 2] + " " + paths[paths.length - 1];
// //               navigator.mediaDevices
// //                 .getDisplayMedia({
// //                   video: true,
// //                   audio: true,
// //                   preferCurrentTab: true,
// //                 })
// //                 .then((stream) => {
// //                   var recorder = new MediaRecorder(stream);

// //                   // Record video chunks in a list
// //                   var chunks = [];
// //                   recorder.ondataavailable = (e) => {
// //                     chunks.push(e.data);
// //                   };

// //                   // Save the video chunks as a blob
// //                   recorder.onstop = (e) => {
// //                     var blob = new Blob(chunks, { type: "video/webm" });
// //                     var videoURL = window.URL.createObjectURL(blob);
// //                     // document.getElementById('video').src = videoURL;

// //                     // Download the video
// //                     var a = document.createElement("a");

// //                     // Set the video url
// //                     a.href = videoURL;

// //                     // Set the video file name
// //                     a.download = `${fileName}.webm`;

// //                     // Trigger the download by clicking the link
// //                     a.click();
// //                   };

// //                   // Start recording
// //                   recorder.start();

// //                   // Stop recording after 5 seconds and save the video
// //                   setTimeout(() => {
// //                     recorder.stop();
// //                   }, duration);
// //                 })
// //                 .catch((err) => {
// //                   console.log(err);
// //                 });
// //             } catch (err) {
// //               console.log(err);
// //               alert("Please Retry");
// //             }
// //           };
// //           // startRecording(request.durationString);
// //           setInterval(() => {
// //             chrome.runtime.sendMessage({ command: "show_time",time: new Date().toLocaleTimeString() });
// //           }, 1000);
// //         },
// //         args: [request],
// //       });
// //     });
// //     sendResponse({ message: "success" });
// //   }
// // });
