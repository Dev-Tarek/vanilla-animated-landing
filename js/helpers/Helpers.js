export const SVG_DOC = 'http://www.w3.org/2000/svg';

export const formatPercent = number => `${number}%`;

export function createSVGText (text, options, style = null) {
    let node = document.createElementNS(SVG_DOC, 'text');
    node.innerHTML = text;
    if (options)
        Object.keys(options).map(key => node.setAttribute(key, options[key]));
    if (style)
        Object.keys(style).map(key => node.style[key] = style[key]);
    return node;
}

export function updateSVGText (node, text = null, options = null, style = null) {
    if (text)
        node.innerHTML = text;
    if (options)
        Object.keys(options).map(key => node.setAttribute(key, options[key]));
    if (style)
        Object.keys(style).map(key => node.style[key] = style[key]);
}

export const animations = {
    SLIDE_UP:       'SLIDE_UP',
    SLIDE_RIGHT:    'SLIDE_RIGHT',
    SLIDE_DOWN:     'SLIDE_DOWN',
    SLIDE_LEFT:     'SLIDE_LEFT',
    FADE_IN:        'FADE_IN',
    FADE_OUT:       'FADE_OUT',
}

export function applyAnimation (element, animation, direction, init = false) {
    if (init) 
        switch (animation) {
            case animations.SLIDE_UP:
                element.style.transform = 'translateY(120%)';
                break;
            case animations.SLIDE_DOWN:
                element.style.transform = 'translateY(-120%)';
                break;
            case animations.SLIDE_RIGHT:
                element.style.transform = 'translateX(-120%)';
                break;
            case animations.SLIDE_LEFT:
                element.style.transform = 'translateX(120%)';
                break;
            case animations.FADE_IN:
                element.style.opacity = 0;
                break;
            case animations.FADE_OUT:
                element.style.opacity = 1;
                break;
        }
    else
        switch (animation) {
            case animations.SLIDE_UP:
                element.style.transform = direction === 'in' ? 'translateY(0%)' : 'translateY(-120%)';
                break;
            case animations.SLIDE_DOWN:
                element.style.transform = direction === 'in' ? 'translateY(0%)' : 'translateY(120%)';
                break;
            case animations.SLIDE_RIGHT:
                element.style.transform = direction === 'in' ? 'translateX(0%)' : 'translateX(120%)';
                break;
            case animations.SLIDE_LEFT:
                element.style.transform = direction === 'in' ? 'translateX(0%)' : 'translateX(-120%)';
                break;
            case animations.FADE_IN:
                element.style.opacity = 1;
                break;
            case animations.FADE_OUT:
                element.style.opacity = 0;
                break;
        }
}