Window_Help.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 1);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = '';
};
Window_Help.prototype.close = function() {
    if (!this.isClosed()) {
        this._closing = true;
    }
    clearInterval(this._offputScroller || 0);
    this._opening = false;
};
Window_Help.prototype.setText = function(text) {
    if (this._text !== text) {
       this._text = text;
       this._scrollPause = 160; // scroll pause
       this._offputScroll = this._scrollPause;
       if(this.textWidth(this._text) < this.contentsWidth()){
           this.refresh(false);
       }else{
           clearInterval(this._offputScroller || 0);
           var _this = this;
           this._offputScroller = setInterval(function(){
               _this.refresh(true);
           }, 10);
       }
    }
};
Window_Help.prototype.refresh = function(doubleLen) {
   var space = "                                               "; // space between repeats
    this.contents.clear();
    this.drawTextEx(
       this._text + (doubleLen ? space + this._text : ''),
       (this._offputScroll < 0 ? this._offputScroll : 0), //x
       0 // y
    );
   this._offputScroll -= 1.5; // scroll speed
   if(Math.abs(this._offputScroll) >= this.textWidth(this._text + space))
       this._offputScroll = this._scrollPause;
};