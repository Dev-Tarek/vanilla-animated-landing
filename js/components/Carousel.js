class Carousel {
    constructor (carousel, images, options) {
        let { transitionSpeed, swipeDelay } = options;
        this.carousel = carousel;
        this.images = images;
        this.swipeDelay = swipeDelay || 5000;
        this.transitionSpeed = transitionSpeed || 500;
        this.currentImageIndex = 0;
        this.currentImageNode = null;
        this.playFunction = false;
    }

    initImage (image, {src, alt}) {
        image.setAttribute('src', src);
        image.setAttribute('alt', alt);
        image.style.transform = 'translateX(-200%) scale(0.2)';
    }
    
    updateIndex () {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }

    render () {
        let { swipeDelay, transitionSpeed } = this;
        let image = document.createElement('img');
        this.initImage(image, this.images[this.currentImageIndex]);
        this.updateIndex();
        this.currentImageNode
            ? this.carousel.replaceChild(image, this.currentImageNode)
            : this.carousel.appendChild(image);
        this.currentImageNode = image;
        setTimeout(() => {
            image.style.transform = 'translateX(0%) scale(1)';
            setTimeout(() => {
                image.style.transform = 'translateX(200%) scale(0.2)';
            }, swipeDelay - 2 * transitionSpeed - 50);
        }, 10);
    }

    play () {
        let { swipeDelay } = this;
        setTimeout(() => {
            this.render();
            this.playFunction = 
                setInterval(() => {
                    this.render();
                }, swipeDelay);
        }, 10);
    }

    pause () {
        clearInterval(this.playFunction);
    }
}

export default Carousel;