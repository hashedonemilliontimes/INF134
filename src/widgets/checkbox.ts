// importing local code, code we have written
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box, Circle} from "../core/ui";

class CheckBox extends Widget {
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private _isChecked: boolean;
    private _checkmark: Circle;
    private _onChangeCallback: ((checked: boolean) => void) | null = null;
    
    private defaultText: string = "Checkbox";
    private defaultFontSize: number = 14;
    private defaultSize: number = 18;
    private defaultTextOffset: number = 25;

    constructor(parent: Window) {
        super(parent);
        // set defaults
        this.height = this.defaultSize;
        this.width = this.defaultSize;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        this._isChecked = false;
        
        // set Aria role
        this.role = RoleType.button;
        
        // render widget
        this.render();
        
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        
        // prevent text selection
        this.selectable = false;
    }

    // Custom label property to get and set the text
    get label(): string {
        return this._input;
    }

    set label(value: string) {
        this._input = value;
        this.update();
    }
    get checked(): boolean {
        return this._isChecked;
    }

    set checked(value: boolean) {
        if (this._isChecked !== value) {
            this._isChecked = value;
            this.update();
            
            if (this._onChangeCallback) {
                this._onChangeCallback(this._isChecked);
            }
        }
    }

    set fontSize(size: number) {
        this._fontSize = size;
        this.update();
    }

    private positionText() {
        let box: Box = this._text.bbox();
        this._text_y = (+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        this._text.x(+this._rect.x() + this.defaultTextOffset);
        if (this._text_y > 0) {
            this._text.y(this._text_y);
        }
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("#388E3C");
        this._rect.radius(3);
        this._rect.fill("#FFFFFF");
        
        this._checkmark = this._group.circle(this.width - 6);
        this._checkmark.center(this._rect.cx(), this._rect.cy());
        this._checkmark.fill("#4CAF50");
        this._checkmark.hide();
        
        this._text = this._group.text(this._input);
        
        this.outerSvg = this._group;
        
        let eventrect = this._group.rect(this.width + this.defaultTextOffset + 100, this.height).opacity(0).attr('id', 0);
        eventrect.x(this._rect.x());
        eventrect.y(this._rect.y());

        this.registerEvent(eventrect);
    }

    override update(): void {
        if (this._text != null) {
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }

        if (this._rect != null) {
            this._rect.fill(this._isChecked ? "#E8F5E9" : "#FFFFFF");
        }
        
        if (this._checkmark != null) {
            if (this._isChecked) {
                this._checkmark.show();
            } else {
                this._checkmark.hide();
            }
        }
        
        super.update();
    }
    
    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.checked = !this.checked;
            this.raise(new EventArgs(this));
        }
    }

    onChange(callback: (checked: boolean) => void): void {
        this._onChangeCallback = callback;
    }
    
    idleupState(): void {
        this._rect.stroke("#388E3C");
    }
    
    idledownState(): void {
        this._rect.stroke("#388E3C");
    }
    
    pressedState(): void {
        this._rect.stroke("#1B5E20");
    }
    
    hoverState(): void {
        this._rect.stroke("#43A047");
    }
    
    hoverPressedState(): void {
        this._rect.stroke("#1B5E20");
    }
    
    pressedoutState(): void {
        this._rect.stroke("#388E3C");
    }
    
    moveState(): void {
        // pass
    }
    
    keyupState(keyEvent?: KeyboardEvent): void {
        // pass
    }
}

export { CheckBox } 