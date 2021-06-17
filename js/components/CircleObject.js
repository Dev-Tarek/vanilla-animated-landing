import { createSVGText, updateSVGText, SVG_DOC, formatPercent } from "../helpers/Helpers.js";

class CircleObject {
    constructor (circlesGroup, options) {
        let {
            path, 
            positionIndex, 
            radius, 
            hoverRadius, 
            iconCode, 
            description, 
            className, 
            fadeSpeed, 
            positions, 
            activeIndex,
            descriptionMargin,
            clickHandler
        } = options;
        this.path = path;
        this.radius = radius || 10;
        this.iconCode = iconCode || '';
        this.className = className || 'circle-obj';
        this.positions = positions || [15, 30, 45, 60, 75];
        this.positionIndex = positionIndex || 0;
        this.description = description;
        this.descriptionMargin = descriptionMargin || { dx: -60, dy: 60 };
        this.activeIndex = activeIndex || 2;
        this.hoverRadius = hoverRadius || 40;
        this.fadeSpeed = fadeSpeed || 1000;
        this.circlesGroup = circlesGroup;
        this.parentGroup = null;
        this.circle = null;
        this.iconText = null;
        this.descriptionGroup = null;
        this.active = false;
        this.clickHandler = clickHandler || (() => null);
    }

    createElements () {
        let { radius, iconCode, className } = this;
        this.parentGroup = document.createElementNS(SVG_DOC, 'g');
        this.circle = document.createElementNS(SVG_DOC, 'circle');
        this.iconText = createSVGText(iconCode, { dy: '14px' }, { 
                'offset-path': `path('${this.path.getPathCurve()}')`,
                'offset-distance': formatPercent(this.getPosition()),
            });
        this.circle.setAttribute('r', radius);
        this.circle.setAttribute('class', className);
        this.parentGroup.setAttribute('class', 'circle-group');
    }

    activateCircle () {
        let { circle, hoverRadius, iconText } = this;
        circle.setAttribute('r', hoverRadius);
        circle.style.stroke = 'none';
        circle.style.fill = '#d88948';
        iconText.style.opacity = '1';
        iconText.style.fontSize = '44px';
    }

    resetCircle () {
        if (!this.active) {
            let { circle, radius, iconText } = this;
            circle.setAttribute('r', radius);
            circle.style.stroke = '#846449';
            circle.style.fill = '#fff';
            iconText.style.opacity = '0';
            iconText.style.fontSize = '24px';
        }
    }

    renderDescriptionText () {
        let { title, text } = this.description;
        let { dx, dy } = this.descriptionMargin;
        let descriptionGroup = document.createElementNS(SVG_DOC, 'g');
        descriptionGroup.style.offsetPath = `path('${this.path.getPathCurve()}')`;
        descriptionGroup.style.offsetDistance = formatPercent(this.getPosition());
        let descriptionHead = createSVGText(title, {
            dx: `${dx}px`,
            dy: `${dy}px`,
            class: 'circle-desc-head',
        });
        let descriptionText = createSVGText(text, { 
            dx: `${dx}px`,
            dy: `${dy + 18}px`,
            class: 'circle-desc-text',
        });
        descriptionGroup.appendChild(descriptionHead);
        descriptionGroup.appendChild(descriptionText);
        this.parentGroup.appendChild(descriptionGroup);
        this.descriptionGroup = descriptionGroup;
    }

    getPositionPoint = () => {
        let { path } = this;
        let pathElement = path.getPathElement();
        let totalLength = pathElement.getTotalLength();
        let positionLength = this.getPosition() / 100 * totalLength;
        let point = pathElement.getPointAtLength(positionLength);
        return { x: point.x, y: point.y }
    }

    positionControl = (steps) => {
        let { positions } = this;
        let reset = false;
        steps = steps % positions.length;
        let newPosition = this.positionIndex + steps;
        if (newPosition < 0) {
            newPosition += positions.length;
            this.parentGroup.style.opacity = 0;
            reset = true;
        }
        else if (newPosition >= positions.length) {
            this.parentGroup.style.opacity = 0;
            newPosition %= positions.length;
            reset = true;
        }
        this.positionIndex = newPosition;
        if (this.positionIndex === this.activeIndex) {
            this.active = true;
            this.activateCircle();
        }
        else {
            this.active = false;
            this.resetCircle();
        }
        return reset;
    }

    getPosition = () => this.positions[this.positionIndex];

    updatePosition = (steps = 0) => {
        let reset = this.positionControl(steps);
        setTimeout(() => { 
            updateSVGText(this.iconText, null, null, { 
                'offset-path' : `path('${this.path.getPathCurve()}')`,
                'offset-distance' : formatPercent(this.getPosition()),
            })
            updateSVGText(this.descriptionGroup, null, null, { 
                'offset-path' : `path('${this.path.getPathCurve()}')`,
                'offset-distance' : formatPercent(this.getPosition()),
            })
            this.circle.style.offsetPath = `path('${this.path.getPathCurve()}')`;
            this.circle.style.motionPath = `path('${this.path.getPathCurve()}')`;
            this.circle.style.offsetDistance = formatPercent(this.getPosition());
            if (reset)
                setTimeout(() => {
                    this.parentGroup.style.opacity = 1
                }, this.fadeSpeed)
        }, reset ? 100 : 0);
    }

    updateIconText = code => this.iconText.innerHTML = code;

    render () {
        this.createElements();
        this.renderDescriptionText();
        this.updatePosition();
        this.parentGroup.appendChild(this.circle);
        this.parentGroup.appendChild(this.iconText);
        this.circlesGroup.appendChild(this.parentGroup);
        this.registerListeners();
    }

    registerListeners () {
        let { parentGroup } = this;
        parentGroup.addEventListener('mouseenter', e => this.activateCircle());
        parentGroup.addEventListener('mouseleave', e => this.resetCircle());
        parentGroup.addEventListener('click', e => this.clickHandler());
    }
}

export default CircleObject;