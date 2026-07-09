/*:
-------------------------------------------------------------------------------
@title Parameter Tables
@author Hime --> HimeWorks (http://himeworks.com)
@version 1.3
@date May 7, 2016
@filename HIME_ParameterTables.js
@url http://himeworks.com/2016/01/parameter-tables-mv/ 

If you enjoy my work, consider supporting me on Patreon!

* https://www.patreon.com/himeworks

If you have any questions or concerns, you can contact me at any of
the following sites:

* Main Website: http://himeworks.com
* Facebook: https://www.facebook.com/himeworkscom/
* Twitter: https://twitter.com/HimeWorks
* Youtube: https://www.youtube.com/c/HimeWorks
* Tumblr: http://himeworks.tumblr.com/

-------------------------------------------------------------------------------
@plugindesc v1.3 - Allows you to use spreadsheet software to maintain
parameters for classes
@help 
-------------------------------------------------------------------------------
== Description ==

Video: https://youtu.be/lZ1O7tgMxMU

In RPG Maker MV, you have eight basic parameters to work with for your actors

  - Max HP
  - max MP
  - Attack
  - Defense
  - Magical Attack
  - Magical Defense
  - Agility
  - Luck
  
Parameters are managed for each class, and your actors' parameters are
determined by their current level along with their current class.

However, the only way to manage your parameters is through the editor,
and the editor does not support

1. Custom parameters that you would like to use in your game
2. Levels beyond 99

This plugin provides you with a way to manage all of your parameters
as external tables which you can edit using text editors like notepad,
or more sophisticated spreadsheet software like Excel.

You can set values for parameters individually for every level between
1 and 99, as well as levels beyond 99.

You can also set values for any custom parameters that you may have in
your game, though you would first need a plugin that provides custom
parameter functionality.

By maintaining your parameters externally, you should have more control
over your game than before.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Free for use in commercial projects, but it would be nice to let me know
- Please provide credits to HimeWorks

== Change Log ==

1.3 - May 7, 2016
 * Implemented actor-based parameter tables
1.2 - Mar 28, 2016
 * fixed bug where last row was not read
 * fixed bug where game never loads if no tables are used
1.1 - Feb 3, 2016
 * fixed bug where due to timing issues, table parsing is skipped
1.0 - Jan 25, 2016
 * initial release

== Usage ==

In your project folder, go to the "Data" folder and created a new folder
called "params".

You will place all of the parameter tables inside this folder, along with
a special configuration file that the plugin uses to tell the game how to
read your tables.

-- Parameter Tables --

To manage parameter curves for each class, you will create a CSV file.
You can download a sample one from here to get started:

  http://himeworks.com/files/rmmv/library/params/class_param_template.csv
  
The first row of the table contains your headers, which are the names of the
parameters that each column represents.

Every row after that is the value of the parameter for the corresponding
level.

The first column on the left is reserved for levels.

So for example, this is how your table might look

Level,Max HP,Max MP,Attack,Defense,Magical Attack,Magical Defense,Agility,Luck
1,100,80,30,10,10,20,15,7
2,110,82,34,13,11,21,16,7
3,120,84,38,16,12,22,17,8
4,130,86,42,19,13,23,18,8
5,140,88,46,22,14,24,19,8

Simply create your table, pick a filename, then save it in the Params folder.

-- Assigning Tables to Classes --

In your class database, note-tag classes with

  <parameter table: NAME_OF_TABLE />
  
To have the class use that table. If you don't specify a table, the game will
just use the default curves provided by the class.

Multiple classes can use the same table if necessary.

-- Assigning Tables to Actors --

By default, actor parameters are based on their current class and current
level. If you wanted actors to have their own parameters and ignore their
class parameters, you can note-tag an actor directly with

  <parameter table: NAME_OF_TABLE />

-- Configuration File --

To get you started, you can download a sample configuration file from here:

  http://himeworks.com/files/rmmv/library/params/config.json
  
If you are using the default parameters in your project, you don't need to
worry about the file since it is set up already for you.

Otherwise, if you are planning to work with custom parameters, or you want
to change the displayed names in the tables, you will need to understand how
to modify the file.
  
The format of the file is as follows

  [
    {
       "name"   : "NAME OF YOUR PARAMETER",
       "type"   : "TYPE OF PARAMETER",
       "symbol" : "FORMULA SYMBOL"
       "id"     : parameterID
    },
    {
       "name"   : "Max HP",
       "symbol" : "mhp"
       "type"   : "basic"       
       "id"     : 0
    }
    ...
  ]
  
The name of the parameter is the name that you used in the table. It must
match the name exactly.

There are three types of parameters:

  - basic
  - extra
  - special
  
These are the three types of parameters available in the game by default.

The ID if the parameter is what the game uses to identify which parameter
to read. The following ID's are reserved:

  basic 0 - max HP
  basic 1 - Max MP
  basic 2 - Attack
  basic 3 - Defense
  basic 4 - Magical Attack
  basic 5 - Magical Defense
  basic 6 - Agility
  basic 7 - Luck

You can have any number of parameters as you need.
   
-------------------------------------------------------------------------------
@param Delimiter
@desc Which character to use as the field delimiter
@default ,
-------------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.TH_ParameterTables = 1;
TH.ParameterTables = TH.ParameterTables || {};

(function ($) {

  $.params = PluginManager.parameters("HIME_ParameterTables");
  $.delimiter = $.params["Delimiter"].trim();
  $.Regex = /<parameter[-_ ]table:\s*(.+?)\s*\/>/im
 
  $.filesNeeded = 0
  $.filesLoaded = 0;
  $.isConfigLoading = false;
  $.isConfigLoaded = false;
  $.isTableLoading = false  
  $.isTableLoaded = false;
  
  $.config = {};
  
  $.loadParameterTables = function() {
    for (var i = 1; i < $dataClasses.length; i++) {
      var obj = $dataClasses[i];            
      $.loadParameterTable(obj);
    }
    
    for (var i = 1; i < $dataActors.length; i++) {
      var obj = $dataActors[i];            
      $.loadParameterTable(obj);
    }
    $.isTableLoading = true;
  }
  
  $.loadParameterTable = function(obj) {
    var res = $.Regex.exec(obj.note);
    if (res) {
      $.filesNeeded++;
      var filename = res[1];
      var xhr = new XMLHttpRequest();
      var url = 'data/params/' + filename + ".csv";
      xhr.open('GET', url);
      xhr.overrideMimeType('application/csv');
      xhr.onload = function() {
        if (xhr.status < 400) {
          $.onTableLoad(obj, xhr.responseText);
        }
      };
      xhr.onerror = function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
      };
      xhr.send();
    }
  };
  
  $.loadConfig = function() {
    var xhr = new XMLHttpRequest();
    var url = "data/params/config.json";
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
      if (xhr.status < 400) {
        $.onConfigLoad(JSON.parse(xhr.responseText));
      }
    };
    xhr.onerror = function() {
      DataManager._errorUrl = DataManager._errorUrl || url;
    };
    xhr.send();
    $.isConfigLoading = true;
  };
  
  $.onConfigLoad = function(data) {
    for (var i = 0; i < data.length; i++) {    
      var obj = data[i];      
      var symbol = obj.symbol;
      var id = obj.id
      $.config[obj.name.toUpperCase()] = obj;
    }    
    $.isConfigLoaded = true;
  };
  
  /* Parameter table is stored as an object, where keys are parameter
   * names are values are arrays of data. The index of each array is the level.
   * Accessing a particular
   */
  $.onTableLoad = function(obj, data) {
    obj.paramTable = {basic: {}, extra: {}, special: {}}
    var columnMap = {}    
    data = data.trim().split(/\n/);
    var rows = data.length;
    var table = [];
    for (var i = 0; i < rows; i ++) {
      table.push(data[i].split($.delimiter));
    }
    // parse headers    
    var headers = table[0];
    for (var i = 1; i < headers.length; i++) {
      columnMap[i] = headers[i].trim();
    }

    // Go through each column, loading up arrays
    for (var key in columnMap) {      
      var paramName = columnMap[key].toUpperCase();
      var conf = $.config[paramName];
      var values = [0];
      for (var i = 1; i < rows; i++) {
        values.push(Math.floor(table[i][key]))
      }
      try {
        obj.paramTable[conf.type][conf.id] = values;
      } catch (e) {
        throw(" --> No configuration data found for parameter '" + columnMap[key] + "'")
      }
    }
    $.filesLoaded++;
    $.isTableLoaded = true;
  };
  
  var TH_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function() {
    var res = TH_DataManager_isDatabaseLoaded.call(this);
    if (res) {      
      if (!$.isConfigLoading) {
        $.loadConfig();
        res = false;
      }
      else if ($.isConfigLoaded && !$.isTableLoading) {
        $.loadParameterTables();
        res = false;
      }
      else if ($.isTableLoading) {
        res = ($.filesNeeded === $.filesLoaded);      
      }
      else {
        // We're not done until tables are loaded.
        res = false;
      }
    }
    return res;
  };
  
  Game_Actor.prototype.parameterTable = function() {
    var table = this.actor().paramTable;
    if (table) {
      return table;
    }    
    table = this.currentClass().paramTable;
    if (table) {
      return table;
    }
    return null;
  };
  
  var TH_GameActor_paramBase = Game_Actor.prototype.paramBase;
  Game_Actor.prototype.paramBase = function(paramId) {
    var table = this.parameterTable();
    if (table) {
      return table.basic[paramId][this._level];
    }
    else {
      return TH_GameActor_paramBase.call(this, paramId);
    }
  };
  
  Game_BattlerBase.prototype.clearParamPlus = function() {
    this._paramPlus = [0,0,0,0,0,0,0,0,0,0,0];
  };

})(TH.ParameterTables);