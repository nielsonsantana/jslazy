

// Author : Nielson Santana
// github.com/nielsonsantana

window.jslazy = (function() {

  function JSLazyLoad() {};

  JSLazyLoad.prototype.createBaseScriptElement = function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    return s;
  };
  
  JSLazyLoad.prototype.createScriptElement = function(href, async) {
    var s = this.createBaseScriptElement()
    s.setAttribute("async", async);
    s.src = href;
    return s;
  };
  JSLazyLoad.prototype.insertScriptOnDom = function(script) {
    // The same code used by Google Analytics
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(script, x);
  };
  
  JSLazyLoad.prototype.appendHrefScript = function(href, async, callback) {
    var s = this.createScriptElement(href, async);
    s.onload = callback;
    this.insertScriptOnDom(s);
  };
  JSLazyLoad.prototype.appendTextScript = function(text) {
    var s = this.createBaseScriptElement();
    s.text = text;
    this.insertScriptOnDom(s);
  };
  
  // Only load the content of NoScript in HTML without append DOM
  JSLazyLoad.prototype.loadNoScriptInHTML = function(noscriptId) {
    var noScriptTag = document.getElementById(noscriptId);
    var divLoadNoScript = document.createElement("div");
    if (noScriptTag) {
      divLoadNoScript.innerHTML = noScriptTag.textContent;
    }
    return divLoadNoScript;
  }

  JSLazyLoad.prototype.getNoScriptTagLoaded = function(noscriptId) {
    var noScriptTag = document.getElementById(noscriptId);
    return this.loadNoScriptInHTML(noscriptId);  
  }
  
  JSLazyLoad.prototype.getElementsByTagAndAttribure = function(dom, tagName, attribute) {
    var arrayElems = [];
    var foundElems = [];
    arrayElems = dom.getElementsByTagName(tagName);
    var elmsLen = arrayElems.length;

    for (var i = 0; i < elmsLen; i++) {
      var elem = arrayElems[i];
      if (elem.hasAttribute(attribute) == true) {
        foundElems.push(elem);
      }
    }
    return foundElems;
  };

  JSLazyLoad.prototype.loadDeferredJavaScriptText = function() {
    var noScriptTag = document.getElementById("deferred-javascript");
    var divLoadNoScript = this.loadNoScriptInHTML("deferred-javascript");
    var scripts = divLoadNoScript.getElementsByTagName("script");

    for (i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      this.appendTextScript(s.text);
    }
    noScriptTag.parentElement.removeChild(noScriptTag);
  };

  JSLazyLoad.prototype.loadDeferredJavascriptWithSource = function() {
    var noScriptTag = document.getElementById("deferred-javascript");
    var temp = this.getNoScriptTagLoaded("deferred-javascript");
    var scripts = this.getElementsByTagAndAttribure(temp, "script", "src");

    scriptSrc = [];
    for (i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      script.parentNode.removeChild(script);
      noScriptTag.textContent = temp.innerHTML;
      scriptSrc.push(script.src);
    }
    loadjs(scriptSrc, {
      success: function() { 
        new JSLazyLoad().loadDeferredJavaScriptText();
      },
      async: false
    });
  };
  
  JSLazyLoad.prototype.loadMainDependencyJS = function() {
    var noScriptTag = document.getElementById("deferred-javascript");
    var temp = this.getNoScriptTagLoaded("deferred-javascript");
    var scripts = this.getElementsByTagAndAttribure(temp, "script", "dependency");
    
    if (scripts.length <= 0) {
      this.loadDeferredJavascriptWithSource();
    }else{
      var scriptSrc = [];
      for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        script.parentNode.removeChild(script);
        noScriptTag.textContent = temp.innerHTML;
        scriptSrc.push(script.src);
      }

      //loadjs lib
      loadjs(scriptSrc, {
        success: function() { 
          new JSLazyLoad().loadDeferredJavascriptWithSource();
        },
        async: false
      });
    }
  };
   
  // Load first the styles 
  JSLazyLoad.prototype.loadDeferredStyles = function() {
    var noScriptTag = document.getElementById("deferred-styles");
    if (!noScriptTag) {
      return;
    }
    var replacement = this.loadNoScriptInHTML("deferred-styles");
    document.body.appendChild(replacement);
    noScriptTag.parentElement.removeChild(noScriptTag);
  };

  var jslazyload = {
    //readyRE = /complete|loaded|interactive/,
    loadCSS: function(selector) {
      var lazy = new JSLazyLoad();
      lazy.loadDeferredStyles();
      return lazy;
    },
    loadJS: function(selector) {
      var lazy = new JSLazyLoad();
      lazy.loadMainDependencyJS();
      return lazy;
    },
    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
  };

  return jslazyload;

}());

var loadJSandCSS = function() {
  jslazy.loadCSS();
  jslazy.loadJS();
}

if (window.addEventListener) {
    window.addEventListener("load", loadJSandCSS);
} else if (document.attachEvent) {
    document.attachEvent("onload", loadJSandCSS);
}