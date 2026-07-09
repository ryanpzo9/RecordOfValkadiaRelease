/*:
-------------------------------------------------------------------------------
@title Enemy Classes Parameter Tables
@author Hime --> HimeWorks (http://himeworks.com)
@version 1.0
@date Feb 4, 2016
@filename HIME_EnemyClassesParameterTables.js
@url 

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
@plugindesc v1.0 - Allows you to have enemy classes read from parameter tables
@help 
-------------------------------------------------------------------------------
== Description ==

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Free for use in commercial projects, but it would be nice to let me know
- Please provide credits to HimeWorks

== Change Log ==

1.0 - Feb 4, 2016
 - initial release

== Usage ==

This is a patch for the following plugins

  Parameter Tables
    http://himeworks.com/2016/01/parameter-tables-mv/
  
  Enemy Classes
    http://himeworks.com/2015/11/enemy-classes-mv/
  
Place this plugin below both of those.

-------------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.TH_EnemyClassesParameterTables = 1;
TH.EnemyClassesParameterTables = TH.EnemyClassesParameterTables || {};

(function ($) {

  var TH_GameEnemy_paramBase = Game_Enemy.prototype.paramBase;
  Game_Enemy.prototype.paramBase = function(paramId) {
    if (this._classId > 0) {
      var table = this.currentClass().paramTable;      
      if (table) {
        return table.basic[paramId][this._level];
      }
      else {
        return TH_GameEnemy_paramBase.call(this, paramId);
      }
    }
    else {    
      return TH_GameEnemy_paramBase.call(this, paramId);
    }    
  };
})(TH.EnemyClassesParameterTables);