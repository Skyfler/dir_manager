"use strict";

var constants = require('./constants.js');
var treeListTemplateFunction = require('../templates/tree-list-template.hbs');
var treeListItemTemplateFunction = require('../templates/tree-list-item-template.hbs');

function DirTree(options) {
    this._elem = options.elem;
    this._baseDirName = '';
    this.returnBaseDirName = this.returnBaseDirName.bind(this);

    this._elem.onmousedown = function() {return false;};
    this._renderDirTree.bind(this)(options.dirObject);
    this._elem.addEventListener('click', this._onClick.bind(this));
}

DirTree.prototype._renderDirTree = function(dirObject) {
    if (!dirObject) {
        return;
    }

    for (var key in dirObject) {
        this._baseDirName = key;
        var treeList = this._createDirTreeList.bind(this)(dirObject[key].content);
        break;
    }

    this._elem.innerHTML = treeList;
};

DirTree.prototype._createDirTreeList = function(dirObject) {
    var listInnerHtml = '';

    for (var key in dirObject) {
        var listItemInnerHtml = '';

        if (dirObject[key].type === constants.directory) {
            listItemInnerHtml = this._createDirTreeList.bind(this)(dirObject[key].content);
        }

        listInnerHtml += this._createDirTreeListItem.bind(this)(dirObject[key].type, key, listItemInnerHtml);
    }

    return treeListTemplateFunction({html: listInnerHtml});
};

DirTree.prototype._createDirTreeListItem = function(type, title, innerHtml) {
    var params = {
        title: title,
        html: innerHtml
    };
    if (type === constants.directory) {
        params.isDirectory = true;
    }
    
    return treeListItemTemplateFunction(params);
};

DirTree.prototype.returnBaseDirName = function() {
    return this._baseDirName;
};

DirTree.prototype.returnPathOfSelection = function() {
    return this._pathOfSelection;
};

DirTree.prototype._onClick = function(e) {
    var elem = e.target;
    this._toggleTreeDirectory.bind(this)(elem);
    this._selectTreeListItem.bind(this)(elem);
};

DirTree.prototype._toggleTreeDirectory = function(elem) {
    var treeListItem = elem.closest('.tree_list_item');

    if (treeListItem && elem.classList.contains('open_list_btn')) {
        treeListItem.classList.toggle('closed');
    }
};

DirTree.prototype._selectTreeListItem = function(elem) {
    var treeListItem = elem.closest('.tree_list_item');

    if (treeListItem && elem.classList.contains('li_title')) {
        if (this._selectedItem) {
            if (this._selectedItem === treeListItem) {
                return;
            }
            this._selectedItem.classList.remove('selected');
        }

        treeListItem.classList.add('selected');
        this._selectedItem = treeListItem;
        this._pathOfSelection = this._findPathOfSelectedItem.bind(this)();

        var eventData = { pathOfSelection: this._pathOfSelection };
        var event = new CustomEvent('treeItemSelection', {
            bubbles: true,
            detail: eventData
        });

        this._elem.dispatchEvent(event);
    }
};

DirTree.prototype._findPathOfSelectedItem = function(listItem) {
    if (!listItem) {
        listItem = this._selectedItem;
    }

    var path = listItem.querySelector('.li_title').textContent.trim();
    if (listItem.classList.contains('directory')) {
        path += ' /';
    }

    var upperDir = listItem.parentElement.closest('.tree_list_item');
    if(upperDir && this._elem.contains(upperDir)) {
        path = this._findPathOfSelectedItem(upperDir) + ' ' + path;
    }

    return path;
};

module.exports = DirTree;