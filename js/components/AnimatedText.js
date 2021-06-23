import { applyAnimation } from '../helpers/Helpers.js';

class AnimatedText {
    constructor (container, textList, options) {
        let { transitionSpeed, swipeDelay } = options;
        this.container = container;
        this.textList = textList;
        this.swipeDelay = swipeDelay || 5000;
        this.transitionSpeed = transitionSpeed || 500;
        this.currentTextIndex = 0;
        this.currentAnimationBlock = null;
        this.currentTextBlocks = null;
    }
    render () {
        let { container, textList, currentTextIndex, transitionSpeed, swipeDelay } = this;
        let animationBlock = document.createElement('div');
        animationBlock.setAttribute('class', 'animation-block');
        let currentTextBlocks = [];
        let queuedAnimations = { 
            in:  textList[currentTextIndex].in,
            out: textList[currentTextIndex].out
        };
        textList[currentTextIndex].text
            .map((word, i) => {
                let textDiv = document.createElement('div');
                let p = document.createElement('p');
                p.innerText = word;
                textDiv.append(p);
                applyAnimation(p, queuedAnimations.in[i], 'in', true);  // Positioning for initial animation
                textDiv.classList.add('text-animation');
                currentTextBlocks.push(textDiv);
                animationBlock.append(textDiv);
            });
        this.currentTextBlocks = currentTextBlocks;
        this.currentAnimationBlock
            ? container.replaceChild(animationBlock, this.currentAnimationBlock)
            : container.appendChild(animationBlock);    
        this.currentAnimationBlock = animationBlock;
        setTimeout(() => {
            this.currentTextBlocks.map((text, i) => {
                applyAnimation(text.children[0], queuedAnimations.in[i], 'in');
            })
        }, transitionSpeed);
        setTimeout(() => {
            this.currentTextBlocks.map((text, i) => {
                applyAnimation(text.children[0], queuedAnimations.out[i], 'out');
            })
        }, swipeDelay - transitionSpeed);
    }
    play () {
        this.render();
        let { textList, swipeDelay } = this;
        return setInterval(() => {
            this.currentTextIndex = (this.currentTextIndex + 1) % textList.length;
            this.render();
        }, swipeDelay + 25) // Safe margin
    }
}

export default AnimatedText;