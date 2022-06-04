/**
 PlistParser: a JavaScript utility to process Plist XML into JSON
 @author Todd Gehman (toddgehman@gmail.com)
 Copyright (c) 2010 Todd Gehman

 --- 

 Usage:
   var jsonString = PlistParser.parse(xmlString);

 ---
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

const PlistParser = {};



PlistParser.parse = function(plist_xml){

  plist_xml = new DOMParser().parseFromString(plist_xml, 'text/xml');
  return this._xml_to_json(plist_xml.getElementsByTagName('plist').item(0));  
  
};

PlistParser._xml_to_json = function(xml_node) {
  
  const parser = this;
  const parent_node = xml_node;
  const parent_node_name = parent_node.nodeName;


  const child_nodes = [];
  for(let i = 0; i < parent_node.childNodes.length; ++i){
    let child = parent_node.childNodes.item(i);
    if (child.nodeName != '#text'){
      child_nodes.push(child);
    };
  };
  
  switch(parent_node_name){

    case 'plist':
      if (child_nodes.length > 1){

        const plist_array = [];
        for(let i = 0; i < child_nodes.length; ++i){
           plist_array.push(parser._xml_to_json(child_nodes[i]));
        };

        return plist_array;
      } else {
        // THIS is the standard case. The top-most node under
        // <plist> is either a <dict> or an <array>.
        return parser._xml_to_json(child_nodes[0]);
      }
      break;

    case 'dict':

      const dictionary = {};
      let key_name,key_value;

      for(let i = 0; i < child_nodes.length; ++i){
        const child = child_nodes[i];
        if (child.nodeName == '#text'){
          // ignore empty text children
        } else if (child.nodeName == 'key'){
          //因为JSON.parse有特殊字符就失败的问题这里把key值都进行编码
          key_name = b64Encode(PlistParser._textValue(child.firstChild));
          
        } else {
          key_value = parser._xml_to_json(child);
          dictionary[key_name] = key_value;
          
        }
      }

      return dictionary;

    case 'array':

      const standard_array = [];
      for(let i = 0; i < child_nodes.length; ++i){
        standard_array.push(parser._xml_to_json(child_nodes[i]));
      }
      return standard_array;

    case 'string':
     
      return [b64Encode(PlistParser._textValue(parent_node)),'string'];

    case 'date':

      const date = PlistParser._parseDate(PlistParser._textValue(parent_node));
      return [date.toString(),'date'];

    case 'integer':
    
      return [parseInt(PlistParser._textValue(parent_node), 10),'integer'];

    case 'real':
    
      return [parseFloat(PlistParser._textValue(parent_node)),'real'];

    case 'data':
      
      return [PlistParser._textValue(parent_node),'data'];

    case 'true':

      return [true,'bool'];

    case 'false':
    
      return [false,'bool'];
      
    
    case '#text':

      break;
  };
};


PlistParser._textValue = function(node) {
  if (node.text){
    return node.text;
  } else {
    return node.textContent;
  };
};

// Handle date parsing in non-FF browsers
// Thanks to http://www.west-wind.com/weblog/posts/729630.aspx
PlistParser._parseDate = function(date_string){
  const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
  const matched_date = reISO.exec(date_string);
  if (matched_date){ 
    return new Date(Date.UTC(+matched_date[1], +matched_date[2] - 1, +matched_date[3], +matched_date[4], +matched_date[5], +matched_date[6]));
  };
};


// Lifted (then modified) from: 
// http://blog.stchur.com/2007/04/06/serializing-objects-in-javascript/
PlistParser.serialize = function(_obj) {
  
  // Other browsers must do it the hard way
  switch (typeof _obj)
  {
    // numbers, booleans, and functions are trivial:
    // just return the object itself since its default .toString()
    // gives us exactly what we want
    case 'number':
    case 'boolean':
    case 'function':
      return _obj;

    // for JSON format, strings need to be wrapped in quotes
    case 'string':
      return '\"' + _obj + '\"';

    case 'object':
      let str;
      if (_obj.constructor === Array || typeof _obj.callee !== 'undefined')
      {
        str = '[';
        let i, len = _obj.length;
        for (i = 0; i < len-1; i++) { str += PlistParser.serialize(_obj[i]) + ','; }
        str += PlistParser.serialize(_obj[i]) + ']';
      }
      else
      {
        str = '{';
        
        for (const key in _obj) { 
          // "The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype."
          if (_obj.hasOwnProperty(key)) {
            str += '"' + key + '":' + PlistParser.serialize(_obj[key]) + ','; 
          };
        };
        str = str.replace(/\,$/, '') + '}';
      }
      return str;

    default:
      return '';
  };
};
