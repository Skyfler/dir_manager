"use strict";

var DirTree = require('./tree.js');
var TreeHeader = require('./header.js');
var CommentManager = require('./comments.js');

function Page(options) {

    this._elem = options.elem;
    this._dirTree = new DirTree({
        elem: this._elem.querySelector('[data-component="dirTree"]'),
        dirObject: options.dirObject
    });
    this._treeHeader = new TreeHeader({
        elem: this._elem.querySelector('[data-component="treeHeader"]'),
        baseDirName: this._dirTree.returnBaseDirName()
    });
    this._commentManager = new CommentManager({
        elem: this._elem.querySelector('[data-component="commentManager"]')
    });

    this._elem.addEventListener('treeItemSelection', this._onTreeItemSelection.bind(this));
    this._elem.addEventListener('commentAdded', this._newCommentHandler.bind(this));
}

Page.prototype._onTreeItemSelection = function(e) {
    var pathOfSelection = e.detail.pathOfSelection;
    var fullPathOfSelection = this._dirTree.returnBaseDirName() + ' / ' + pathOfSelection;
    
    this._treeHeader.setDirPathTitle(pathOfSelection);
    this._showComments.bind(this)(fullPathOfSelection);
};

Page.prototype._showComments = function(fullPathOfSelection) {
    this._loadComments.bind(this)(fullPathOfSelection, function(response) {
        console.log('Got comments for ' + fullPathOfSelection);
        var commentsObj = { comments: response };
        this._commentManager.renderComments(commentsObj);
    });
};

Page.prototype._loadComments = function(fullPathOfSelection, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/comments?path=' + fullPathOfSelection, true);

    function onLoad() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            callback.bind(this)(JSON.parse(xhr.responseText));
        }
    }

    xhr.addEventListener('load', onLoad.bind(this));

    xhr.send();
};

Page.prototype._newCommentHandler = function(e) {
    var commentText = e.detail.commentText;
    var fullPathOfSelection = this._dirTree.returnBaseDirName() + ' / ' + this._dirTree.returnPathOfSelection();

    this._postNewComment.bind(this)(commentText, fullPathOfSelection, function() {
        this._loadComments.bind(this)(fullPathOfSelection, function(response) {
            console.log('Got comments for ' + fullPathOfSelection);
            var commentsObj = { comments: response };
            this._commentManager.renderComments(commentsObj);
        });
    });
};

Page.prototype._postNewComment = function(commentText, fullPathOfSelection, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/comment?action=add&path=' + fullPathOfSelection, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    function onLoad() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log(xhr.responseText);
            callback.bind(this)();
        }
    }

    xhr.addEventListener('load', onLoad.bind(this));
    console.log('Sending comment "' + commentText + '"');
    xhr.send('commentText=' + commentText);
};

module.exports = Page;