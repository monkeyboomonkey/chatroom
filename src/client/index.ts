import { io } from "socket.io-client";

const socket = io('ws://localhost:3001');

socket.on('message', text => {
  const el = document.createElement('li');
  el.innerHTML = text;
  const ul = document.querySelector('ul')
  if (ul) {
    ul.appendChild(el);
  }
});

// const button = document.querySelector('button');
// console.log(button);
// if (button) {
//   button.onclick = () => {
//     console.log("Button clicked!");
//     const text = document.querySelector('input');
//     if (text) {
//       socket.emit('message', text.value)
//     }
//   }
// }

document.querySelector('button').onclick = () => {
  console.log("Button clicked!");
  const text = document.querySelector('input');
  if (text) {
    socket.emit('message', text.value)
  }
}

