# eduCKate
Tour guide module for angular.

[Live demo](http://cklsylabs.com/#/educkate)

``bower install educkate``

**Add to your app**  

Include bower_components/ckanvas/dist/css/ckanvas.min.css and bower_components/ckanvas/dist/js/ckanvas.min.js

angular.module('app', ['cKanvas'])

<br />
## Directive

The ckanvas directive creates a canvas element that draws based on data in it's paths attribute.

**Markup:**
```html
<ckanvas center=true|false offset-x="number:pixels" offset-y="number:pixels" paths="pathArray" responsive=true|false transform-controls=true|false  zoom="number:1===100"></ckanvas>
```
**Attributes**  

  ``center`` - Optional. When set to true, will center the drawing in the canvas.  

  ``offset-x`` - Optional. Offset the drawing in relation to the canvas in pixels.  

  ``offset-x`` - Optional. Offset the drawing in relation to the canvas in pixels.  

  ``paths`` - Required. Data array to draw. Each array element represents a draw operation and must an object with a 'vertices' property which is an array of x and y points for a path operation. The properties property is an object that defines the styling.  

  ```javascript
    [
      {
            properties: {} // OBJECT: canvas propeties, i.e. fillStyle:'#FFFFFF', strokeStyle:'#000000', etc. required for .stroke() and .fill()
            vertices:[
                [x, y],
                [x, y],
                ...
            ]
        }
    ]
  ```

  ``responsive`` - Optional. Will set the width/height of the canvas to percentages and will also listen for the directives width/height changes and redraw.  

  ``transform-controls`` - Optional. Will display zoom in/out buttons and allow you to drag the canvas around in the directive.  

  ``zoom`` - Optional. Zoom in or out of the drawing. Minimum zoom is 100%. Value of 1 equals 100%, 2 equals 200%.
