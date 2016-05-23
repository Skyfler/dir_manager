"use strict";

function TreeHeader(options) {
    this._elem = options.elem;
    this._baseDirName = options.baseDirName;
    this.setDirPathTitle = this.setDirPathTitle.bind(this);
    
    this.setDirPathTitle('');
}

TreeHeader.prototype.setDirPathTitle = function(curPath) {
    this._elem.innerHTML = this._baseDirName + ' / ' + curPath;
};

module.exports = TreeHeader;