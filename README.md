
# JSLazy

JSLazy is a small library for async loading of JavaScript and CSS. JSLazy was built on top of [LoadJS](https://github.com/muicss/loadjs)

Usage
-----

JSLazy allow load JavaScript and CSS files in lazy mode.

Example for CSS:

    <noscript id="deferred-styles">

    <link rel="stylesheet" href="css_file_1.css">
    <link rel="stylesheet" href="css_file_2.css" type="text/css">      
    <link rel="stylesheet" href="css_file_3.css" type="text/css">

    </noscript>

Example for JavaScript:

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

The attribute `dependency` indicates that the JavaScript shoud be loaded as dependency, before run any script. All JavaScripts are fetched async and parallel and loaded on DOM in order of occurrence.


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
