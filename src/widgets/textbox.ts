import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
import {Rect, Text, Box, Circle} from "../core/ui";

class TextBox extends Widget {
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private _onChangeCallback: ((text: string) => void) | null = null;
    private _isFocused: boolean = false;
    
    private defaultText: string = "Text Box";
    private defaultFontSize: number = 14;
    private defaultWidth: number = 100;
    private defaultHeight: number = 30;
    private defaultTextOffset: number = 5;

    constructor(parent: Window) {
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

    // Custom label property to get and set the text
    get label(): string {
        return this._input;
    }

    set label(value: string) {
        this._input = value;
        this.update();
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
        
        // Create the textbox box
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("#388E3C");
        this._rect.radius(3);
        this._rect.fill("#FFFFFF");
        
        // Create the text label
        this._text = this._group.text(this._input);
        
        // Set the outer svg element 
        this.outerSvg = this._group;
        
        // Add a transparent rect on top of text to 
        // prevent selection cursor and to handle mouse events
        let eventrect = this._group.rect(this.width, this.height).opacity(0).attr('id', 0);
        eventrect.x(this._rect.x());
        eventrect.y(this._rect.y());

        // register objects that should receive event notifications
        this.registerEvent(eventrect);
    }

    override update(): void {
        if (this._text != null) {
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }
        
        super.update();
    }
    
    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.raise(new EventArgs(this));
            this._isFocused = true;
            this._rect.stroke("#1B5E20");
        }
    }

    // Event handler for state changes
    onChange(callback: (text: string) => void): void {
        this._onChangeCallback = callback;
    }
    
    // State methods to control the visual appearance of the widget
    idleupState(): void {
        if (!this._isFocused) {
            this._rect.stroke("#388E3C");
        }
    }
    
    idledownState(): void {
        if (!this._isFocused) {
            this._rect.stroke("#388E3C");
        }
    }
    
    pressedState(): void {
        this._rect.stroke("#1B5E20");
    }
    
    hoverState(): void {
        if (!this._isFocused) {
            this._rect.stroke("#43A047");
        }
    }
    
    hoverPressedState(): void {
        this._rect.stroke("#1B5E20");
    }
    
    pressedoutState(): void {
        if (!this._isFocused) {
            this._rect.stroke("#388E3C");
        }
    }
    
    moveState(): void {
        // pass
    }
    
    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && this._isFocused) {
            // Handle backspace
            if (keyEvent.key === "Backspace") {
                this._input = this._input.slice(0, -1);
                this.update();
                if (this._onChangeCallback) {
                    this._onChangeCallback(this._input);
                }
            }
            // Handle regular character input
            else if (keyEvent.key.length === 1) {
                this._input += keyEvent.key;
                this.update();
                if (this._onChangeCallback) {
                    this._onChangeCallback(this._input);
                }
            }
            // Handle Enter key to lose focus
            else if (keyEvent.key === "Enter") {
                this._isFocused = false;
                this._rect.stroke("#388E3C");
            }
            // Handle Escape key to lose focus
            else if (keyEvent.key === "Escape") {
                this._isFocused = false;
                this._rect.stroke("#388E3C");
            }
        }
    }
}

export { TextBox } 