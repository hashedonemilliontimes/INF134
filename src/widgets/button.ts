// importing local code, code we have written
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box} from "../core/ui";

class Button extends Widget{
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string= "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 80;
    private defaultHeight: number = 30;
    private _onClickCallback: (() => void) | null = null;

    constructor(parent:Window){
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        // set Aria role
        this.role = RoleType.button;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        // prevent text selection
        this.selectable = false;
    }

    // Custom label property to get and set the text on the button
    get label(): string {
        return this._input;
    }

    set label(value: string) {
        this._input = value;
        this.update();
    }

    // Custom size properties to get and set height and width
    get buttonWidth(): number {
        return this.width;
    }

    set buttonWidth(value: number) {
        this.width = value;
        this.update();
    }

    get buttonHeight(): number {
        return this.height;
    }

    set buttonHeight(value: number) {
        this.height = value;
        this.update();
    }

    set fontSize(size:number){
        this._fontSize= size;
        this.update();
    }

    private positionText(){
        let box:Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        this._text.x(+this._rect.x() + 4);
        if (this._text_y > 0){
            this._text.y(this._text_y);
        }
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("green");
        this._rect.radius(5);
        this._rect.fill("#4CAF50");
        this._text = this._group.text(this._input);
        // Set the outer svg element 
        this.outerSvg = this._group;
        // Register the main button rectangle for events so the whole area is clickable
        this.registerEvent(this._rect);
    }

    override update(): void {
        if(this._text != null) {
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }

        if(this._rect != null) {
            this._rect.fill(this.backcolor);
            this._rect.width(this.width);
            this._rect.height(this.height);
        }
        
        super.update();
    }
    
    pressReleaseState(): void{
        if (this.previousState instanceof PressedWidgetState) {
            this.raise(new EventArgs(this));
            // Call the onClick callback if it exists
            if (this._onClickCallback) {
                this._onClickCallback();
            }
        }
    }

    onClick(callback: () => void): void {
        this._onClickCallback = callback;
    }

    idleupState(): void {
        this._rect.fill("#4CAF50");
        this._rect.stroke("#388E3C");
    }
    
    idledownState(): void {
        this._rect.fill("#4CAF50"); 
        this._rect.stroke("#388E3C");
    }
    
    pressedState(): void {
        this._rect.fill("#2E7D32");
        this._rect.stroke("#1B5E20"); 
    }
    
    hoverState(): void {
        this._rect.fill("#66BB6A");
        this._rect.stroke("#43A047");
    }
    
    hoverPressedState(): void {
        this._rect.fill("#2E7D32");
        this._rect.stroke("#1B5E20");
    }
    
    pressedoutState(): void {
        this._rect.fill("#4CAF50");
        this._rect.stroke("#388E3C");
    }
    
    moveState(): void {
        // No special visual change for move state
    }
    
    keyupState(keyEvent?: KeyboardEvent): void {
        // No special visual change for keyup state
    }
}

export {Button}