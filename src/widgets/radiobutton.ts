// importing local code, code we have written
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box, Circle, G} from "../core/ui";

class RadioButton extends Widget {
    private _circle: Circle;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private _isSelected: boolean;
    private _innerCircle: Circle;
    private _onChangeCallback: ((index: number) => void) | null = null;
    private _index: number;
    private _radioGroup: string;
    private _svgGroup: G;
    
    private defaultText: string = "Radio Button";
    private defaultFontSize: number = 14;
    private defaultSize: number = 18;
    private defaultTextOffset: number = 25;
    private static radioGroups: Map<string, RadioButton[]> = new Map();

    constructor(parent: Window, group: string, index: number) {
        super(parent);
        // set defaults
        this.height = this.defaultSize;
        this.width = this.defaultSize;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        this._isSelected = false;
        this._index = index;
        this._radioGroup = group;
        
        RadioButton.addToGroup(this);
        
        // set Aria role
        this.role = RoleType.button;
        
        // render widget
        this.render();
        
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        
        // prevent text selection
        this.selectable = false;
    }

    private static addToGroup(radio: RadioButton): void {
        if (!RadioButton.radioGroups.has(radio._radioGroup)) {
            RadioButton.radioGroups.set(radio._radioGroup, []);
        }
        
        const group = RadioButton.radioGroups.get(radio._radioGroup);
        if (group) {
            while (group.length <= radio._index) {
                group.push(null);
            }
            group[radio._index] = radio;
            
            if (group.filter(r => r !== null).length === 1) {
                radio.checked = true;
            }
        }
    }

    get label(): string {
        return this._input;
    }

    set label(value: string) {
        this._input = value;
        this.update();
    }

    get checked(): boolean {
        return this._isSelected;
    }

    set checked(value: boolean) {
        if (this._isSelected !== value) {
            this._isSelected = value;
            
            if (value) {
                const group = RadioButton.radioGroups.get(this._radioGroup);
                if (group) {
                    group.forEach(radio => {
                        if (radio && radio !== this && radio._isSelected) {
                            radio._isSelected = false;
                            radio.update();
                        }
                    });
                }
            }
            
            this.update();
            
            if (this._onChangeCallback && value) {
                this._onChangeCallback(this._index);
            }
        }
    }

    set fontSize(size: number) {
        this._fontSize = size;
        this.update();
    }

    private positionText() {
        let box: Box = this._text.bbox();
        this._text_y = (+this._circle.cy() - (box.height/2));
        this._text.x(+this._circle.cx() + this.defaultTextOffset);
        if (this._text_y > 0) {
            this._text.y(this._text_y);
        }
    }
    
    render(): void {
        this._svgGroup = (this.parent as Window).window.group();
        
        this._circle = this._svgGroup.circle(this.width);
        this._circle.stroke("#388E3C");
        this._circle.fill("#FFFFFF");
        
        this._innerCircle = this._svgGroup.circle(this.width - 8);
        this._innerCircle.center(this._circle.cx(), this._circle.cy());
        this._innerCircle.fill("#4CAF50");
        this._innerCircle.hide();
        
        this._text = this._svgGroup.text(this._input);
        
        this.outerSvg = this._svgGroup;
        let eventrect = this._svgGroup.rect(this.width + this.defaultTextOffset + 100, this.height).opacity(0).attr('id', 0);
        eventrect.x(this._circle.cx() - this.width/2);
        eventrect.y(this._circle.cy() - this.height/2);

        this.registerEvent(eventrect);
        
        this._circle.fill("#FFFFFF");
        
        this._innerCircle.center(this._circle.cx(), this._circle.cy());
        
        this._svgGroup.attr({
            role: this.role,
            tabindex: this.tabindex
        });
    }

    override update(): void {
        if (this._text != null) {
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }
        
        if (this._innerCircle != null) {
            if (this._isSelected) {
                this._innerCircle.show();
            } else {
                this._innerCircle.hide();
            }
        }
        
        if (this.outerSvg != null) {
            super.update();
        }
    }
    
    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.checked = true;
            this.raise(new EventArgs(this));
        }
    }

    onChange(callback: (index: number) => void): void {
        this._onChangeCallback = callback;
    }
    
    idleupState(): void {
        if (this._circle) {
            this._circle.stroke("#388E3C");
        }
    }
    
    idledownState(): void {
        if (this._circle) {
            this._circle.stroke("#388E3C");
        }
    }
    
    pressedState(): void {
        if (this._circle) {
            this._circle.stroke("#1B5E20");
        }
    }
    
    hoverState(): void {
        if (this._circle) {
            this._circle.stroke("#43A047");
        }
    }
    
    hoverPressedState(): void {
        if (this._circle) {
            this._circle.stroke("#1B5E20");
        }
    }
    
    pressedoutState(): void {
        if (this._circle) {
            this._circle.stroke("#388E3C");
        }
    }
    
    moveState(): void {
        // pass
    }
    
    keyupState(keyEvent?: KeyboardEvent): void {
        // pass
    }
}

export { RadioButton } 