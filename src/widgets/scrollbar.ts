// importing local code, code we have written
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box, Circle} from "../core/ui";

class ScrollBar extends Widget {
    private _track: Rect;
    private _thumb: Rect;
    private _upButton: Rect;
    private _downButton: Rect;
    private _upArrow: Text;
    private _downArrow: Text;
    private _onScrollCallback: ((position: number) => void) | null = null;
    
    private defaultHeight: number = 200;
    private defaultWidth: number = 20;
    private defaultThumbHeight: number = 40;
    private defaultButtonHeight: number = 20;
    private minThumbHeight: number = 20;
    private thumbPosition: number = 0;
    private isDragging: boolean = false;
    private dragStartY: number = 0;
    private dragStartThumbY: number = 0;
    private _x: number = 0;
    private _y: number = 0;
    
    constructor(parent: Window) {
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        
        // set Aria role
        this.role = RoleType.scrollbar;
        
        // render widget
        this.render();
        
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        
        // prevent text selection
        this.selectable = false;

        if (this._group) {
            this._group.x(0);
            this._group.y(0);
        }
    }

    get scrollHeight(): number {
        return this.height;
    }

    set scrollHeight(value: number) {
        this.height = value;
        this.update();
    }

    get position(): number {
        return this.thumbPosition;
    }

    set fontSize(size: number) {
        // pass
    }

    private calculateThumbHeight(): number {
        // Calculate thumb height based on content size (simplified)
        // In a real implementation, this would be based on the content size
        return Math.max(this.minThumbHeight, this.defaultThumbHeight);
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        
        this._track = this._group.rect(this.width, this.height);
        this._track.stroke("#388E3C");
        this._track.fill("#E8F5E9");
        this._track.x(this._x);
        this._track.y(this._y);
        
        this._upButton = this._group.rect(this.width, this.defaultButtonHeight);
        this._upButton.stroke("#388E3C");
        this._upButton.fill("#4CAF50");
        this._upButton.x(this._x);
        this._upButton.y(this._y);
        
        this._downButton = this._group.rect(this.width, this.defaultButtonHeight);
        this._downButton.stroke("#388E3C");
        this._downButton.fill("#4CAF50");
        this._downButton.x(this._x);
        this._downButton.y(this._y + this.height - this.defaultButtonHeight);
        
        const thumbHeight = this.calculateThumbHeight();
        this._thumb = this._group.rect(this.width, thumbHeight);
        this._thumb.stroke("#388E3C");
        this._thumb.fill("#66BB6A");
        this._thumb.x(this._x);
        this._thumb.y(this._y + this.defaultButtonHeight);
        
        this._upArrow = this._group.text("▲");
        this._upArrow.font('size', 12);
        this._upArrow.center(this._upButton.cx(), this._upButton.cy());
        
        this._downArrow = this._group.text("▼");
        this._downArrow.font('size', 12);
        this._downArrow.center(this._downButton.cx(), this._downButton.cy());
        
        this.outerSvg = this._group;
        
        this.registerEvent(this._upButton);
        this.registerEvent(this._downButton);
        this.registerEvent(this._thumb);
        this.registerEvent(this._track);
        
        this._group.attr({
            role: this.role,
            tabindex: this.tabindex
        });

        // --- Attach event handlers ---
        // Dragging the thumb
        this._thumb.on('mousedown', (event: MouseEvent) => {
            event.stopPropagation();
            this.thumbMouseDown(event.clientY);
            // Listen for mousemove and mouseup on window
            const mouseMoveHandler = (moveEvent: MouseEvent) => {
                this.thumbMouseMove(moveEvent.clientY);
            };
            const mouseUpHandler = () => {
                this.thumbMouseUp();
                window.removeEventListener('mousemove', mouseMoveHandler);
                window.removeEventListener('mouseup', mouseUpHandler);
            };
            window.addEventListener('mousemove', mouseMoveHandler);
            window.addEventListener('mouseup', mouseUpHandler);
        });

        // Up button click
        this._upButton.on('click', (_event: MouseEvent) => {
            this.upButtonClick();
        });

        // Down button click
        this._downButton.on('click', (_event: MouseEvent) => {
            this.downButtonClick();
        });

        this._track.on('click', (event: MouseEvent) => {
            const rect = (event.target as SVGGraphicsElement).getBoundingClientRect();
            const y = event.clientY - rect.top + this._y;
            this.trackClick(y);
        });
    }

    override update(): void {
        if (this._track != null) {
            this._track.height(this.height);
            this._track.width(this.width);
            this._track.x(this._x);
            this._track.y(this._y);
            
            // Position the up button
            this._upButton.width(this.width);
            this._upButton.height(this.defaultButtonHeight);
            this._upButton.x(this._x);
            this._upButton.y(this._y);
            
            // Position the down button
            this._downButton.width(this.width);
            this._downButton.height(this.defaultButtonHeight);
            this._downButton.x(this._x);
            this._downButton.y(this._y + this.height - this.defaultButtonHeight);
            
            // Position the arrows
            this._upArrow.center(this._upButton.cx(), this._upButton.cy());
            this._downArrow.center(this._downButton.cx(), this._downButton.cy());
        }
        
        if (this._thumb != null) {
            const thumbHeight = this.calculateThumbHeight();
            this._thumb.height(thumbHeight);
            this._thumb.width(this.width);
            
            // Calculate the maximum thumb position
            const maxThumbY = this.height - this.defaultButtonHeight - thumbHeight;
            
            // Ensure thumb position is within bounds
            this.thumbPosition = Math.max(0, Math.min(maxThumbY, this.thumbPosition));
            
            // Update thumb position
            this._thumb.x(this._x);
            this._thumb.y(this._y + this.defaultButtonHeight + this.thumbPosition);
        }
        
        super.update();
    }
    
    // Handle mouse down on the thumb
    thumbMouseDown(y: number): void {
        this.isDragging = true;
        this.dragStartY = y;
        this.dragStartThumbY = this.thumbPosition;
    }
    
    // Handle mouse move to update thumb position
    thumbMouseMove(y: number): void {
        if (this.isDragging) {
            const deltaY = y - this.dragStartY;
            const newThumbY = this.dragStartThumbY + deltaY;
            
            // Calculate the maximum thumb position
            const maxThumbY = this.height - this.defaultButtonHeight - Number(this._thumb.height());
            
            // Update thumb position within bounds
            this.thumbPosition = Math.max(0, Math.min(maxThumbY, newThumbY));
            
            // Update the thumb position - fix the y-coordinate to be relative to the track's position
            this._thumb.y(Number(this._track.y()) + this.defaultButtonHeight + this.thumbPosition);
            
            // Call the scroll callback
            if (this._onScrollCallback) {
                this._onScrollCallback(this.thumbPosition);
            }
        }
    }
    
    // Handle mouse up to stop dragging
    thumbMouseUp(): void {
        this.isDragging = false;
    }
    
    // Handle track click to move the thumb
    trackClick(y: number): void {
        // Calculate the click position relative to the track
        const trackY = y - Number(this._track.y()) - this.defaultButtonHeight;
        
        // Calculate the maximum thumb position
        const maxThumbY = this.height - this.defaultButtonHeight - Number(this._thumb.height());
        
        // If click is above the thumb, move up by a page
        if (trackY < this.thumbPosition) {
            this.thumbPosition = Math.max(0, this.thumbPosition - Number(this._thumb.height()));
        } 
        // If click is below the thumb, move down by a page
        else if (trackY > this.thumbPosition + Number(this._thumb.height())) {
            this.thumbPosition = Math.min(maxThumbY, this.thumbPosition + Number(this._thumb.height()));
        }
        
        // Update the thumb position - fix the y-coordinate to be relative to the track's position
        this._thumb.y(Number(this._track.y()) + this.defaultButtonHeight + this.thumbPosition);
        
        // Call the scroll callback
        if (this._onScrollCallback) {
            this._onScrollCallback(this.thumbPosition);
        }
    }
    
    // Handle up button click
    upButtonClick(): void {
        // Move the thumb up by a small amount
        this.thumbPosition = Math.max(0, this.thumbPosition - 10);
        
        // Update the thumb position - fix the y-coordinate to be relative to the track's position
        this._thumb.y(Number(this._track.y()) + this.defaultButtonHeight + this.thumbPosition);
        
        // Call the scroll callback
        if (this._onScrollCallback) {
            this._onScrollCallback(this.thumbPosition);
        }
    }
    
    // Handle down button click
    downButtonClick(): void {
        // Calculate the maximum thumb position
        const maxThumbY = this.height - this.defaultButtonHeight - Number(this._thumb.height());
        
        // Move the thumb down by a small amount
        this.thumbPosition = Math.min(maxThumbY, this.thumbPosition + 10);
        
        // Update the thumb position - fix the y-coordinate to be relative to the track's position
        this._thumb.y(Number(this._track.y()) + this.defaultButtonHeight + this.thumbPosition);
        
        // Call the scroll callback
        if (this._onScrollCallback) {
            this._onScrollCallback(this.thumbPosition);
        }
    }
    
    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.raise(new EventArgs(this));
        }
    }

    // Event handler for scroll changes
    onScroll(callback: (position: number) => void): void {
        this._onScrollCallback = callback;
    }
    
    // State methods to control the visual appearance of the widget
    idleupState(): void {
        this._track.stroke("#388E3C");
        this._upButton.stroke("#388E3C");
        this._downButton.stroke("#388E3C");
        this._thumb.stroke("#388E3C");
    }
    
    idledownState(): void {
        this._track.stroke("#388E3C");
        this._upButton.stroke("#388E3C");
        this._downButton.stroke("#388E3C");
        this._thumb.stroke("#388E3C");
    }
    
    pressedState(): void {
        this._track.stroke("#1B5E20");
        this._upButton.stroke("#1B5E20");
        this._downButton.stroke("#1B5E20");
        this._thumb.stroke("#1B5E20");
    }
    
    hoverState(): void {
        this._track.stroke("#43A047");
        this._upButton.stroke("#43A047");
        this._downButton.stroke("#43A047");
        this._thumb.stroke("#43A047");
    }
    
    hoverPressedState(): void {
        this._track.stroke("#1B5E20");
        this._upButton.stroke("#1B5E20");
        this._downButton.stroke("#1B5E20");
        this._thumb.stroke("#1B5E20");
    }
    
    pressedoutState(): void {
        this._track.stroke("#388E3C");
        this._upButton.stroke("#388E3C");
        this._downButton.stroke("#388E3C");
        this._thumb.stroke("#388E3C");
    }
    
    moveState(): void {
        // pass
    }
    
    keyupState(keyEvent?: KeyboardEvent): void {
        // pass
    }

    override move(x: number, y: number): void {
        this._x = x;
        this._y = y;
        this.update();
    }
}

export { ScrollBar } 