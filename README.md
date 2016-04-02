# walKthru
Tour guide directive for angular.

[Live demo](http://cklsylabs.com/#/walkthru)

``bower install walKthru``

**Add to your app**  

Include:
  bower_components/walkthru/dist/css/walkthru.min.css
  bower_components/walkthru/dist/js/walkthru.min.js
  bower_components/font-awesome/css/font-awesome.min.css

angular.module('app', ['walKthru'])

<br />
## Directive

The walkthru directive creates a canvas element that draws based on data in it's paths attribute.

**Markup:**
```html
<walkthru steps="OBJECT" blur=BOOL index=NUMBER><walkthru>
```
**Attributes**  

  ``blur`` - Optional. Whether or not to use CSS blur filter, defaults to false. On pages with a lot of markup, set this to false to improve performance.  

  ``index`` - Optional. Start on an index other than 0.  

  ``steps`` - Required. Data object.  

  ```javascript
    {
        steps: [
            text: STRING - can be text or HTML,
            element: STRING - CSS selector
            fn: FUNCTION - called before each step
        ],
        onInitialize: FUNCTION - called on start,
        onDone: FUNCTION - called on end,
        onNext: FUNCTION - called when next button is clicked,
        onPrevious: FUNCTION - called when previous button is clicked
    }
  ```
