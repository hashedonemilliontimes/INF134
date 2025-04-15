import {Window} from "./core/ui"
import {Button} from "./widgets/button"
import {Heading} from "./widgets/heading"
import {CheckBox} from "./widgets/checkbox"
import {RadioButton} from "./widgets/radiobutton"
import {ScrollBar} from "./widgets/scrollbar"
import {ProgressBar} from "./widgets/progressbar"
import {ToggleSwitch} from "./widgets/toggleswitch"
import {TextBox} from "./widgets/textbox"

let w = new Window(window.innerHeight-10,'100%');

let titleHeading = new Heading(w);
titleHeading.text = "UI Widget Toolkit Demo";
titleHeading.tabindex = 1;
titleHeading.fontSize = 24;
titleHeading.move(10, 20);

/* Button */
let buttonHeading = new Heading(w);
buttonHeading.text = "Button Widget";
buttonHeading.tabindex = 2;
buttonHeading.fontSize = 18;
buttonHeading.move(10, 60);

let buttonStatusLbl = new Heading(w);
buttonStatusLbl.text = "No clicks yet";
buttonStatusLbl.tabindex = 3;
buttonStatusLbl.fontSize = 14;
buttonStatusLbl.move(10, 90);

let clickCount = 0;

let btn = new Button(w);
btn.tabindex = 4;
btn.fontSize = 14;
btn.label = "Click Me!";
btn.buttonWidth = 120;
btn.buttonHeight = 40;
btn.move(12, 120);

btn.onClick(() => {
    clickCount++;
    buttonStatusLbl.text = `Button clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}!`;
    console.log(`Button clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}!`);
});

/* Checkbox */
let checkboxHeading = new Heading(w);
checkboxHeading.text = "Checkbox Widget";
checkboxHeading.tabindex = 5;
checkboxHeading.fontSize = 18;
checkboxHeading.move(10, 180);

let checkboxStatusLbl = new Heading(w);
checkboxStatusLbl.text = "Checkbox is unchecked";
checkboxStatusLbl.tabindex = 6;
checkboxStatusLbl.fontSize = 14;
checkboxStatusLbl.move(10, 210);

let checkbox = new CheckBox(w);
checkbox.tabindex = 7;
checkbox.fontSize = 14;
checkbox.label = "Check me";
checkbox.move(12, 240);

checkbox.onChange((checked) => {
    checkboxStatusLbl.text = `Checkbox is ${checked ? 'checked' : 'unchecked'}`;
    console.log(`Checkbox state changed: ${checked ? 'checked' : 'unchecked'}`);
});

/* Radio Button */
let radioHeading = new Heading(w);
radioHeading.text = "Radio Button Widget";
radioHeading.tabindex = 8;
radioHeading.fontSize = 18;
radioHeading.move(10, 300);

let radioStatusLbl = new Heading(w);
radioStatusLbl.text = "No radio button selected";
radioStatusLbl.tabindex = 9;
radioStatusLbl.fontSize = 14;
radioStatusLbl.move(10, 330);

let radioGroup = "demoGroup";
let radio1 = new RadioButton(w, radioGroup, 0);
radio1.tabindex = 10;
radio1.fontSize = 14;
radio1.label = "Option 1";
radio1.move(50, 360);

let radio2 = new RadioButton(w, radioGroup, 1);
radio2.tabindex = 11;
radio2.fontSize = 14;
radio2.label = "Option 2";
radio2.move(50, 390);

let radio3 = new RadioButton(w, radioGroup, 2);
radio3.tabindex = 12;
radio3.fontSize = 14;
radio3.label = "Option 3";
radio3.move(50, 420);

radio1.onChange((index) => {
    radioStatusLbl.text = `Radio button ${index + 1} selected`;
    console.log(`Radio button ${index + 1} selected`);
});

radio2.onChange((index) => {
    radioStatusLbl.text = `Radio button ${index + 1} selected`;
    console.log(`Radio button ${index + 1} selected`);
});

radio3.onChange((index) => {
    radioStatusLbl.text = `Radio button ${index + 1} selected`;
    console.log(`Radio button ${index + 1} selected`);
});

/* Scrollbar */
let scrollbarHeading = new Heading(w);
scrollbarHeading.text = "Scrollbar Widget";
scrollbarHeading.tabindex = 13;
scrollbarHeading.fontSize = 18;
scrollbarHeading.move(640, 60);

let scrollbarStatusLbl = new Heading(w);
scrollbarStatusLbl.text = "Scrollbar position: 0";
scrollbarStatusLbl.tabindex = 14;
scrollbarStatusLbl.fontSize = 14;
scrollbarStatusLbl.move(640, 90);

let scrollbar = new ScrollBar(w);
scrollbar.tabindex = 15;
scrollbar.scrollHeight = 200;
scrollbar.move(600, 120);

scrollbar.onScroll((position) => {
    scrollbarStatusLbl.text = `Scrollbar position: ${position}`;
    console.log(`Scrollbar position: ${position}`);
});

/* Progress bar */
let progressHeading = new Heading(w);
progressHeading.text = "Progress Bar Widget";
progressHeading.tabindex = 16;
progressHeading.fontSize = 18;
progressHeading.move(300, 60);

let progressStatusLbl = new Heading(w);
progressStatusLbl.text = "Progress: 0%";
progressStatusLbl.tabindex = 17;
progressStatusLbl.fontSize = 14;
progressStatusLbl.move(300, 90);

let progressBar = new ProgressBar(w);
progressBar.tabindex = 18;
progressBar.barWidth = 200;
progressBar.incrementValue = 10;
progressBar.move(300, 120);

progressBar.onIncrement((value) => {
    progressStatusLbl.text = `Progress: ${value}%`;
    console.log(`Progress bar incremented to: ${value}%`);
});

progressBar.onStateChange((state) => {
    console.log(`Progress bar state changed to: ${state}`);
});

let incrementBtn = new Button(w);
incrementBtn.tabindex = 19;
incrementBtn.fontSize = 14;
incrementBtn.label = "Increment Progress";
incrementBtn.buttonWidth = 150;
incrementBtn.buttonHeight = 40;
incrementBtn.move(300, 150);

incrementBtn.onClick(() => {
    progressBar.increment();
});

/* Toggle switch */
let toggleHeading = new Heading(w);
toggleHeading.text = "Toggle Switch Widget";
toggleHeading.tabindex = 20;
toggleHeading.fontSize = 18;
toggleHeading.move(300, 210);

let toggleStatusLbl = new Heading(w);
toggleStatusLbl.text = "Toggle is OFF";
toggleStatusLbl.tabindex = 21;
toggleStatusLbl.fontSize = 14;
toggleStatusLbl.move(300, 240);

let toggleSwitch = new ToggleSwitch(w);
toggleSwitch.tabindex = 22;
toggleSwitch.fontSize = 14;
toggleSwitch.label = "Toggle Switch";
toggleSwitch.move(300, 270);

toggleSwitch.onToggle((isOn) => {
    toggleStatusLbl.text = `Toggle is ${isOn ? 'ON' : 'OFF'}`;
    console.log(`Toggle switch state changed to: ${isOn ? 'ON' : 'OFF'}`);
});

/* Textbox */
let textboxHeading = new Heading(w);
textboxHeading.text = "Text Box Widget";
textboxHeading.tabindex = 23;
textboxHeading.fontSize = 18;
textboxHeading.move(300, 330);

let textbox = new TextBox(w);
textbox.tabindex = 24;
textbox.fontSize = 14;
textbox.label = "";
textbox.move(300, 360);

textbox.onChange((text) => {
    console.log(`Textbox content changed to: ${text}`);
});
