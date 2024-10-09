// Base values are now relative to the screen size
var baseRadius = Math.min(window.innerWidth, window.innerHeight) / 4;  // Base layer radius (third layer)
var secondLayerRadius = baseRadius * 0.75;  // Second layer radius
var firstLayerRadius = baseRadius * 0.5;  // First layer radius
var fourthLayerRadius = 0;  // Fourth layer radius (slightly smaller)
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 90;
var imgHeight = 110;

var bgMusicURL = 'https://user-images.githubusercontent.com/151072490/283747943-7b08424b-8647-4bdc-996c-965063dbb5e3.mp4';
var bgMusicControls = true;

setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid];


// Adjust the spin container size
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById('ground');
ground.style.width = baseRadius * 3 + "px";
ground.style.height = baseRadius * 3 + "px";



// Initialize layers
// Function to move an element out when hovered
function moveOutOnHover(element, radius) {
    element.addEventListener('mouseenter', function() {
        let currentZ = parseFloat(element.style.transform.match(/translateZ\((.*?)px\)/)[1]);
        let newZ = currentZ + 20; // Move out by 20px
        element.style.transform = element.style.transform.replace(/translateZ\((.*?)px\)/, `translateZ(${newZ}px)`);
    });

    element.addEventListener('mouseleave', function() {
        let currentZ = parseFloat(element.style.transform.match(/translateZ\((.*?)px\)/)[1]);
        let newZ = currentZ - 20; // Move back to original position
        element.style.transform = element.style.transform.replace(/translateZ\((.*?)px\)/, `translateZ(${newZ}px)`);
    });
}


// Initialize layers
function init(delayTime) {
    var firstLayerCount = 5;
    var secondLayerCount = 6;
    var thirdLayerCount = 8;
    var fourthLayerCount = 1;  // Fourth layer has only one image

    // Adjust the whole structure slightly downwards (e.g., by 50px)
    var downwardOffset = 30;

    for (var i = 0; i < aEle.length; i++) {
        var layer, angle, radius, yOffset;

        // Determine layer-specific angle, radius, and position
        if (i < fourthLayerCount) {
            // Fourth layer logic
            layer = 4;
            radius = fourthLayerRadius;
            angle = 0;  // Only one image, no rotation needed
            yOffset = -baseRadius * 2; // Move fourth layer to the top center part of the cake
            aEle[i].style.transform = `rotateY(${angle}deg) translateY(${yOffset}px) translateZ(${radius}px)`;
        } else if (i < fourthLayerCount + firstLayerCount) {
            layer = 1;
            radius = firstLayerRadius;
            // Clockwise rotation for the first layer
            angle = (i - fourthLayerCount) * (360 / firstLayerCount);
            yOffset = -baseRadius / 0.85 - downwardOffset; // Position first layer
            aEle[i].style.transform = `rotateY(${angle}deg) translateY(${yOffset}px) translateZ(${radius}px)`;
        } else if (i < fourthLayerCount + firstLayerCount + secondLayerCount) {
            layer = 2;
            radius = secondLayerRadius;
            // Counterclockwise rotation for the second layer
            angle = -(i - (fourthLayerCount + firstLayerCount)) * (360 / secondLayerCount);
            yOffset = -baseRadius / 1.8 - downwardOffset; // Position second layer
            aEle[i].style.transform = `rotateY(${angle}deg) translateY(${yOffset}px) translateZ(${radius}px)`;
        } else {
            layer = 3;
            radius = baseRadius;
            // Clockwise rotation for the third layer
            angle = (i - (fourthLayerCount + firstLayerCount + secondLayerCount)) * (360 / thirdLayerCount);
            yOffset = 0 - downwardOffset; // Position third layer
            aEle[i].style.transform = `rotateY(${angle}deg) translateY(${yOffset}px) translateZ(${radius}px)`;
        }
        
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";

        // Add hover effect to move elements out
        moveOutOnHover(aEle[i], radius);
    }
}




function applyTranform(obj) {
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;
    obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + tX + "deg)";
}

function playSpin(yes) {
    ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

if (autoRotate) {
    var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
    ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

document.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    e = e || window.event;
    sX = e.clientX;
    sY = e.clientY;

    this.onpointermove = function (e) {
        e = e || window.event;
        nX = e.clientX;
        nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTranform(odrag);
        sX = nX;
        sY = nY;
    };

    this.onpointerup = function (e) {
        odrag.timer = setInterval(function () {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTranform(odrag);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(odrag.timer);
                playSpin(true);
            }
        }, 17);
        this.onpointermove = this.onpointerup = null;
    };
    return false;
};

document.onmousewheel = function (e) {
    e = e || window.event;
    var d = e.wheelDelta / 20 || -e.detail;
    baseRadius += d;
    secondLayerRadius += d / 2; // Keep ratio between layers
    firstLayerRadius += d / 3;
    fourthLayerRadius += d / 4; // Adjust for the fourth layer
    init(1);
};