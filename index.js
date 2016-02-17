'use strict';
const escapeRegex = require('escape-regex');

module.exports = easyRegex;

/**
 * Convert `str` to a `RegExp`.
 *
 * @param {String} str
 * @return {RegExp}
 * @api private
 */

function easyRegex(str) {
    const listStr   = [],
          optsList  = [];
    
    if (str instanceof RegExp) return str;
    
    str.split(':').forEach(function (s, sIdx) {
        listStr[sIdx] = [];
        s.split('|').forEach(function (o, oIdx) {
            listStr[sIdx][oIdx] = escapeRegex(o).replace(/\\\*/g, '(.+)');
        });
    });
    listStr.forEach(function (list, i) {
        let opts = list.join('|');
        
        if (list.length > 1) opts = '(' + opts + ')';
        optsList[i] = opts; 
    });
    return new RegExp(`^${optsList.join(':')}$`);
}
