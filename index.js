'use strict';
const toFactory     = require('tofactory'),
      escapeRegex   = require('escape-regex'),
      bracketsRegex = /^\{.*\}$/,
      brackets      = /[\{\}]/g,
      paramError    = new Error('"route" parameter must be a string.'),
      toString      = Object.prototype.toString;

module.exports = toFactory(EasyRegex);

/**
 * Convert `str` to a `RegExp`.
 *
 * @param {String} str
 * @return {RegExp}
 * @api private
 */
function EasyRegex(spec) {
    let regex, str, delimeter;
    
    const listKeys  = [];
    
    init();
    
    return {
        source: regex.source,
        test,
        exec,
        getArrayResult,
        getObjectResult
    };
    
    function init() {
        if (toString.call(spec) === '[object Object]') {
            str = spec.route;
            delimeter = spec.delimeter;
        } else {
            str = spec;
        }
        
        if (typeof str !== 'string' || str instanceof RegExp) throw paramError;
        
        delimeter = delimeter || ':';
        
        regex = createRegex();
    }
    
    function test(routeString) {
        return regex.test(routeString);
    }
    
    function exec(routeString) {
        return regex.exec(routeString);
    }
    
    function getArrayResult(routeString) {
        return regex.exec(routeString).slice(1);
    }
    
    function getObjectResult(routeString) {
        const resultObj = {},
              resultList = getArrayResult(routeString);
        
        listKeys.forEach(function (key, i) {
            resultObj[key] = resultList[i];
        });
        
        return resultObj;
    }
    
    function createRegex() {
        const optsList  = [],
              listStr   = [];
        
        str.split(delimeter).forEach(function (s, sidx) {
            let opts;
            
            s = s.trim();
            listStr[sidx] = [];
            
            if (bracketsRegex.test(s)) {
                let route   = s.split('=');
                
                listKeys[sidx] = route[0].trim().replace(brackets, '');
                opts = route[1] ? route[1].trim().replace(brackets, '') : '*';    
            } else {
                opts = s;
                listKeys[sidx] = sidx + '';
            }

            opts.split('|').forEach(function (o, i) {
                listStr[sidx][i] = escapeRegex(o).replace(/\\\*/g, '(.+)');
            });
        });
        
        listStr.forEach(function (list, i) {
            let opts = list.join('|');
            
            if (list.length > 1) opts = '(' + opts + ')';
            optsList[i] = opts; 
        });
        
        return new RegExp(`^${optsList.join(delimeter)}$`);
    }
}