# jquery.directive.js API #


```javascript
jQuery.directive( name, callback );
```

## Description

Registers a callback function that will be called for any
existing or future DOM element that will match the directive name. The callback
will be executed for every element individually.

## Arguments

* **name** `String`

  The directive name, which must be unique. Can have 2 forms:

  1. If it starts with a `.` (period) and contains no spaces
  it will match elements by CSS class name. For example,
  `$.directive(".myDirective", ...)` will match `<div class="myDirective">`

  2. Anything else will match elements by attribute name.
  For example `$.directive("my-directive", ...)` will match `<div my-directive>`
  and `<div data-my-directive>`.

* **callback** `Function(element, attributes)`

  The callback function that will be called for every matching
  element. The function will receive 2 arguments:

  * **element** `jQuery object`

    The matching element wrapped in a jQuery object.

  * **attributes** `Object`

    An object containing all the HTML attributes and values of the matching
    element. Values will automatically be converted to booleans, integers,
    floats and JSON objects when appropriate.

## Examples

Here's a basic example: all elements with the attribute `big-red-border` will
receive a big red border.

```html
<div big-red-border></div>
```

```javascript
$.directive('big-red-border', function(element, attributes) {
    element.css({
        border: '10px solid red'
    });
});
```

Will result in:
```html
<div big-red-border style="border: 10px solid red"></div>
```



Inside a directive callback, you are free to manipulate the element:

```html
<div hello-world></div>
```

```javascript
$.directive('hello-world', function(element, attributes) {
    element.prepend('<h1>Hello, world!</h1>');
});
```

Will result in:
```html
<div hello-world>
    <h1>Hello, world!</h1>
</div>
```

Directives can be combined:

```html
<div hello-world big-red-border></div>
```

Or nested:

```html
<div big-red-border>
    <div hello-world></div>
</div>
```
