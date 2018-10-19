/* global AFRAME */

(function () {
  if ( typeof window.CustomEvent === "function" ) return false;
    function CustomEvent ( event, params ) {
     params = params || { bubbles: false, cancelable: false, detail: undefined };
     var evt = document.createEvent( 'CustomEvent' );
     evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
     return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;


  // Polyfill always provides us with `navigator.getVRDisplays`
  navigator.getVRDisplays().then(displays => {
    // If we have a native VRDisplay, or if the polyfill
    // provided us with a CardboardVRDisplay, use it
    if (displays.length) {
      vrDisplay = displays[0];
      controls = new THREE.VRControls(camera);
      vrDisplay.requestAnimationFrame(animate);
    } else {
      // If we don't have a VRDisplay, we're probably on
      // a desktop environment, so set up desktop-oriented controls
      controls = new THREE.OrbitControls(camera);
      requestAnimationFrame(animate);
    }
  });
})();

  

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('set-image', {
    schema: {
      on: {type: 'string'},
      target: {type: 'selector'},
      src: {type: 'string'},
      dur: {type: 'number', default: 300}
    },
  
    init: function () {
      var data = this.data;
      var el = this.el;
  
      this.setupFadeAnimation();
  
      el.addEventListener(data.on, function () {
        // Fade out image.
        data.target.emit('set-image-fade');
        // Wait for fade to complete.
        setTimeout(function () {
          // Set image.
          data.target.setAttribute('material', 'src', data.src);
        }, data.dur);
      });
    },
  
    /**
     * Setup fade-in + fade-out.
     */
    setupFadeAnimation: function () {
      var data = this.data;
      var targetEl = this.data.target;
  
      // Only set up once.
      if (targetEl.dataset.setImageFadeSetup) { return; }
      targetEl.dataset.setImageFadeSetup = true;
  
      // Create animation.
      targetEl.setAttribute('animation__fade', {
        property: 'material.color',
        startEvents: 'set-image-fade',
        dir: 'alternate',
        dur: data.dur,
        from: '#FFF',
        to: '#000'
      });
    }
  });