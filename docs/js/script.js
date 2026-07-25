/*typed.js*/
var typed = new Typed("#sub_ti", {
  strings: ['"Nest"', '"Home"', '"Space"'],
  typeSpeed: 50,
  backSpeed: 50,
  smartBackspace: true,
  backDelay: 1500,
  loop: true,
});

/*canvas shit*/
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.style.backgroundColor = "lightgray";
canvas.style.backgroundImage = "url('Front-end/img/space.png')";
context.imageSmoothingEnabled = false;

/*Secret messages on the console*/

let text_1 = "Welcome to the web Dev how is it going ?";
let text_2 =
  "If you are here probably you are looking for a way to personalize your nest, and you are in the right place.";
console.log(text_1);
console.log(text_2);
console.log(`
╔════════════════════╗
║     MeetGeon       ║
╚════════════════════╝
`);

/*Button script*/
document.querySelector(".button").addEventListener("click", () => {
  window.location.href = "#"; //meeting.html
});
