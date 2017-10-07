/*! loadjs - v3.5.1 */
loadjs=function(){function e(e,n){var t,r,i,c=[],o=(e=e.push?e:[e]).length,f=o;for(t=function(e,t){t.length&&c.push(e),--f||n(c)};o--;)r=e[o],(i=s[r])?t(r,i):(u[r]=u[r]||[]).push(t)}function n(e,n){if(e){var t=u[e];if(s[e]=n,t)for(;t.length;)t[0](e,n),t.splice(0,1)}}function t(e,n,r,i){var o,s,u=document,f=r.async,a=(r.numRetries||0)+1,h=r.before||c;i=i||0,/(^css!|\.css$)/.test(e)?(o=!0,(s=u.createElement("link")).rel="stylesheet",s.href=e.replace(/^css!/,"")):((s=u.createElement("script")).src=e,s.async=void 0===f||f),s.onload=s.onerror=s.onbeforeload=function(c){var u=c.type[0];if(o&&"hideFocus"in s)try{s.sheet.cssText.length||(u="e")}catch(e){u="e"}if("e"==u&&(i+=1)<a)return t(e,n,r,i);n(e,u,c.defaultPrevented)},!1!==h(e,s)&&u.head.appendChild(s)}function r(e,n,r){var i,c,o=(e=e.push?e:[e]).length,s=o,u=[];for(i=function(e,t,r){if("e"==t&&u.push(e),"b"==t){if(!r)return;u.push(e)}--o||n(u)},c=0;c<s;c++)t(e[c],i,r)}function i(e,t,i){var s,u;if(t&&t.trim&&(s=t),u=(s?i:t)||{},s){if(s in o)throw"LoadJS";o[s]=!0}r(e,function(e){e.length?(u.error||c)(e):(u.success||c)(),n(s,e)},u)}var c=function(){},o={},s={},u={};return i.ready=function(n,t){return e(n,function(e){e.length?(t.error||c)(e):(t.success||c)()}),i},i.done=function(e){n(e,[])},i.reset=function(){o={},s={},u={}},i.isDefined=function(e){return e in o},i}();

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
    try {
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(script, x); 
    } catch (error) {
      console.log(error);
    }
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
