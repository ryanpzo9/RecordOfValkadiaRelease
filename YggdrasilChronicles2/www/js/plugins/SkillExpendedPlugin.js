Window_Help.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    //var height = this.fittingHeight(numLines || 4);
    var height = this.fittingHeight(3);//3 lines. Change 3 to whatever number you want
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = '';
};
Window_Help.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text.replace(/\\n/g,"\n");
        this.refresh();
    }
};