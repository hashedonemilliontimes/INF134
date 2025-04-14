import {Window} from "./core/ui"
import {Button} from "./widgets/button"
import {Heading} from "./widgets/heading"


let w = new Window(window.innerHeight-10,'100%');

let lbl1= new Heading(w);
lbl1.text = "Button Demo";
lbl1.tabindex = 1;
lbl1.fontSize = 16;
lbl1.move(10,20);

let statusLbl = new Heading(w);
statusLbl.text = "No clicks yet";
statusLbl.tabindex = 3;
statusLbl.fontSize = 14;
statusLbl.move(10, 90);

let clickCount = 0;

let btn = new Button(w);
btn.tabindex = 2;
btn.fontSize = 14;
btn.label = "Click Me!";
btn.buttonWidth = 120;
btn.buttonHeight = 40;
btn.move(12, 50);

btn.onClick(() => {
    clickCount++;
    statusLbl.text = `Button clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}!`;
});
