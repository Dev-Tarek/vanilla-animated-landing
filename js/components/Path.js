import { SVG_DOC } from "../helpers/Helpers.js";

class Path {
    constructor (svgId, pointsPercents, options) {
        let { control, color, width, cap, fill } = options;
        this.svgId = svgId;
        this.percents = pointsPercents;
        this.color = color || '#FFF';
        this.width = width || '8';
        this.cap = cap || 'round';
        this.fill = fill || 'transparent';
        this.control = control || 100;
        this.path = null;
    }

    getPathElement = () => this.path;

    getPathCurve = () => this.curve;

    updatePointPercents = (pointsPercents, regenerate = false) => {
        this.percents = pointsPercents;
        if (regenerate)
            this.generatePath();
    }
    
    updateControl = (control, regenerate = false) => {
        this.control = control;
        if (regenerate)
            this.generatePath();
    }

    calculatePoints = () => {
        this.points = this.percents.map(point => [ point[0] / 100 * window.innerWidth, point[1] / 100 * window.innerHeight ]);
    }

    generatePath () {
        this.calculatePoints();
        let { points, control } = this;
        let path = document.createElementNS(SVG_DOC, 'path');
        let curve = `M ${points[0][0]} ${points[0][1]} S `;
        this.points.map(point => {
            curve += `${point[0] - control} ${point[1]} ${point[0]} ${point[1]} `;
        })
        this.curve = curve;
        path.setAttribute('d', curve);
        return path;
    }

    render () {
        let { svgId, color, width, cap, fill } = this;
        const svg = document.getElementById(svgId);
        let path = this.generatePath();
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', width);
        path.setAttribute('stroke-linecap', cap);
        path.setAttribute('fill', fill);
        this.path
            ? svg.replaceChild(path, this.path)
            : svg.appendChild(path);
        this.path = path;
    }
}

export default Path;