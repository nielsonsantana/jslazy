
# JSLazy

JSLazy is a small library for async loading of JavaScript and CSS. JSLazy was built on top of [LoadJS](https://github.com/muicss/loadjs)

The latest version of JSLazy can be found in the `dist/` directory in this repository:
 * [jslazy.js](https://cdn.rawgit.com/nielsonsantana/jslazy/master/dist/jslazy.js)
 * [jslazy.min.js](https://cdn.rawgit.com/nielsonsantana/jslazy/master//dist/jslazy.min.js)

To get the best performance, is recommended load JSLazy as inline.

Usage
-----

JSLazy allow load JavaScript and CSS files in lazy mode.

### Example for CSS:

    <noscript id="deferred-styles">

    <link rel="stylesheet" href="css_file_1.css">
    <link rel="stylesheet" href="css_file_2.css" type="text/css">      
    <link rel="stylesheet" href="css_file_3.css" type="text/css">

    </noscript>

### Example for JavaScript:
The attribute `dependency` indicates that the JavaScript should be loaded as dependency, before run any script. All JavaScripts are fetched async and parallel and loaded on DOM in order of occurrence.


    <noscript id="deferred-javascript">

    <!-- JS Global Compulsory --> 
    <script dependency type="text/javascript" src="{{ STATIC_URL }}1.8.2/jquery.min.js" defer></script>
    <script dependency type="text/javascript" src="{{ STATIC_URL }}plugins/bootstrap/js/bootstrap.min.js" defer></script> 
    
    <!-- JS Plugins -->
    <script dependency type="text/javascript" src="{{ STATIC_URL }}plugins/select2-3.3/select2.min.js" defer></script>
    
    <!-- JS Page Level -->
    <script type="text/javascript" src="{{ STATIC_URL }}js/app.js" defer></script>

    <script type="text/javascript">

      console.log('Loaded JavaScript');

    </script>

    </noscript>


Browser Support
-------------
Support all browsers supported by [LoadJS](https://github.com/muicss/loadjs#browser-support)


 * IE9+ (`async: false` support only works in IE10+)
 * Opera 12+
 * Safari 5+
 * Chrome
 * Firefox
 * iOS 6+
 * Android 4.4+

LoadJS also detects script load failures from AdBlock Plus and Ghostery in:

 * Safari
 * Chrome
