// importing local code, code we have written
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box} from "../core/ui";

class ProgressBar extends Widget {
    private _track: Rect;
    private _progress: Rect;
    private _text: Text;
    private _onIncrementCallback: ((value: number) => void) | null = null;
    private _onStateChangeCallback: ((state: string) => void) | null = null;
    
    private defaultHeight: number = 20;
    private defaultWidth: number = 200;
    private _value: number = 0;
    private _incrementValue: number = 10;
    private _maxValue: number = 100;
    
    constructor(parent: Window) {
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        
        // set Aria role
        this.role = RoleType.none;
        
        // render widget
        this.render();
        
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        
        // prevent text selection
        this.selectable = false;
    }

    get barWidth(): number {
        return this.width;
    }

    set barWidth(value: number) {
        this.width = value;
        this.update();
    }

    get incrementValue(): number {
        return this._incrementValue;
    }

    set incrementValue(value: number) {
        this._incrementValue = value;
    }

    get value(): number {
        return this._value;
    }

    set fontSize(size: number) {
        // pass
    }

    increment(amount?: number): void {
        const incrementAmount = amount !== undefined ? amount : this._incrementValue;
        const oldValue = this._value;
        
        // update the value within bounds
        this._value = Math.min(this._maxValue, this._value + incrementAmount);
        
        this.update();
        
        if (this._value !== oldValue && this._onIncrementCallback) {
            this._onIncrementCallback(this._value);
        }
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        
        this._track = this._group.rect(this.width, this.height);
        this._track.stroke("#388E3C");
        this._track.fill("#E8F5E9");
        this._track.radius(3);
        this._track.x(0);
        this._track.y(0);
        
        // Create the progress bar
        this._progress = this._group.rect(0, this.height);
        this._progress.stroke("none");
        this._progress.fill("#4CAF50");
        this._progress.radius(3);
        this._progress.x(0);
        this._progress.y(0);
        
        // Create the text label
        this._text = this._group.text("0%");
        this._text.font('size', 12);
        this._text.center(this._track.cx(), this._track.cy());
        
        // Set the outer svg element 
        this.outerSvg = this._group;
        
        // Don't register events for the track since we don't want the progress bar to respond to interactions
        // this.registerEvent(this._track);
        
        // Set the role attribute directly on the SVG group
        this._group.attr({
            role: this.role,
            tabindex: this.tabindex
        });
    }

    override update(): void {
        if (this._track != null) {
            this._track.width(this.width);
        }
        
        if (this._progress != null) {
            const progressWidth = (this._value / this._maxValue) * this.width;
            this._progress.width(progressWidth);
            this._progress.x(Number(this._track.x()));
            this._progress.y(Number(this._track.y()));
        }
        
        if (this._text != null) {
            this._text.text(`${Math.round(this._value)}%`);
            this._text.center(this._track.cx(), this._track.cy());
        }
        
        super.update();
    }
    
    pressReleaseState(): void {
        // pass
    }

    onIncrement(callback: (value: number) => void): void {
        this._onIncrementCallback = callback;
    }
    
    onStateChange(callback: (state: string) => void): void {
        this._onStateChangeCallback = callback;
    }
    
    idleupState(): void {
        // No visual changes needed for progress bar
        // Don't trigger callbacks for state changes
        // if (this._onStateChangeCallback) {
        //     this._onStateChangeCallback("idleup");
        // }
    }
    
    idledownState(): void {
        // No visual changes needed for progress bar
        // Don't trigger callbacks for state changes
        // if (this._onStateChangeCallback) {
        //     this._onStateChangeCallback("idledown");
        // }
    }
    
    pressedState(): void {
        // No visual changes needed for progress bar
        // Don't trigger callbacks for state changes
        // if (this._onStateChangeCallback) {
        //     this._onStateChangeCallback("pressed");
        // }
    }
    
    hoverState(): void {
        // No visual changes needed for progress bar
        // Don't trigger callbacks for state changes
        // if (this._onStateChangeCallback) {
        //     this._onStateChangeCallback("hover");
        // }
    }
    
    hoverPressedState(): void {
        // No visual changes needed for progress bar
        // Don't trigger callbacks for state changes
        // if (this._onStateChangeCallback) {
        //     this._onStateChangeCallback("hoverPressed");
        // }
    }
    
    pressedoutState(): void {
        // No visual changes needed for progress bar
        // Don't trigger callbacks for state changes
        // if (this._onStateChangeCallback) {
        //     this._onStateChangeCallback("pressedout");
        // }
    }
    
    moveState(): void {
        // No visual changes needed for progress bar
        // Don't trigger callbacks for state changes
        // if (this._onStateChangeCallback) {
        //     this._onStateChangeCallback("move");
        // }
    }
    
    keyupState(keyEvent?: KeyboardEvent): void {
        // No visual changes needed for progress bar
        // Don't trigger callbacks for state changes
        // if (this._onStateChangeCallback) {
        //     this._onStateChangeCallback("keyup");
        // }
    }
}

export { ProgressBar } 