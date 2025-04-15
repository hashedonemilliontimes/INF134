// importing local code, code we have written
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box, Circle} from "../core/ui";

class ToggleSwitch extends Widget {
    private _track: Rect;
    private _thumb: Circle;
    private _text: Text;
    private _onToggleCallback: ((isOn: boolean) => void) | null = null;
    
    private defaultHeight: number = 30;
    private defaultWidth: number = 60;
    private defaultText: string = "Toggle Switch";
    private defaultThumbSize: number = 26;
    private _isOn: boolean = false;
    private _fontSize: number = 12;
    private _text_y: number = 0;
    
    constructor(parent: Window) {
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        
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
        return this._text.text();
    }

    set label(value: string) {
        this._text.text(value);
        this.positionText();
    }

    // Custom isOn property to get and set the toggle state
    get isOn(): boolean {
        return this._isOn;
    }

    set isOn(value: boolean) {
        if (this._isOn !== value) {
            this._isOn = value;
            this.update();
            
            // Call the onToggle callback if it exists
            if (this._onToggleCallback) {
                this._onToggleCallback(this._isOn);
            }
        }
    }

    set fontSize(size: number) {
        this._fontSize = size;
        this._text.font('size', this._fontSize);
        this.positionText();
    }

    private positionText() {
        let box: Box = this._text.bbox();
        this._text_y = (+this._track.y() + ((+this._track.height()/2)) - (box.height/2));
        this._text.x(+this._track.x() + this.width + 10);
        if (this._text_y > 0) {
            this._text.y(this._text_y);
        }
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        
        // Create the track
        this._track = this._group.rect(this.width, this.height);
        this._track.radius(this.height/2);
        this._track.fill("#E0E0E0");
        
        // Create the thumb
        this._thumb = this._group.circle(this.defaultThumbSize);
        this._thumb.center(this.defaultThumbSize/2, this.height/2);
        this._thumb.fill("#FFFFFF");
        this._thumb.stroke("#BDBDBD");
        
        // Create the text label
        this._text = this._group.text(this.defaultText);
        
        // Set the outer svg element 
        this.outerSvg = this._group;
        
        // Add a transparent rect on top of text to 
        // prevent selection cursor and to handle mouse events
        let eventrect = this._group.rect(this.width + 150, this.height).opacity(0).attr('id', 0);
        eventrect.x(this._track.x());
        eventrect.y(this._track.y());

        // register objects that should receive event notifications
        this.registerEvent(eventrect);
    }

    override update(): void {
        if (this._track != null) {
            this._track.fill(this._isOn ? "#4CAF50" : "#E0E0E0");
        }
        
        if (this._thumb != null) {
            this._thumb.center(
                this._isOn ? Number(this._track.x()) + Number(this._track.width()) - this.defaultThumbSize/2 : 
                             Number(this._track.x()) + this.defaultThumbSize/2, 
                Number(this._track.y()) + this.height/2
            );
        }
        
        if (this._text != null) {
            this._text.font('size', this._fontSize);
            this.positionText();
        }
        
        super.update();
    }
    
    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.isOn = !this.isOn;
            this.raise(new EventArgs(this));
        }
    }

    // Event handler for toggle changes
    onToggle(callback: (isOn: boolean) => void): void {
        this._onToggleCallback = callback;
    }
    
    // State methods to control the visual appearance of the widget
    idleupState(): void {
        this._track.stroke("#388E3C");
        this._thumb.stroke("#388E3C");
    }
    
    idledownState(): void {
        this._track.stroke("#388E3C");
        this._thumb.stroke("#388E3C");
    }
    
    pressedState(): void {
        this._track.stroke("#1B5E20");
        this._thumb.stroke("#1B5E20");
    }
    
    hoverState(): void {
        this._track.stroke("#43A047");
        this._thumb.stroke("#43A047");
    }
    
    hoverPressedState(): void {
        this._track.stroke("#1B5E20");
        this._thumb.stroke("#1B5E20");
    }
    
    pressedoutState(): void {
        this._track.stroke("#388E3C");
        this._thumb.stroke("#388E3C");
    }
    
    moveState(): void {
        // pass
    }
    
    keyupState(keyEvent?: KeyboardEvent): void {
        // pass
    }
}

export { ToggleSwitch } 