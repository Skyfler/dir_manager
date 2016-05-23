"use strict";

var commentsListTemplate = require('../templates/comments-list-template.hbs');
var commentFormTemplate = require('../templates/comment-form-template.hbs');

function CommentManager(options) {
    this._elem = options.elem;
    this.renderComments = this.renderComments.bind(this);

    this._elem.addEventListener('click', this._onClick.bind(this));
    //this.renderComments();
}

CommentManager.prototype.renderComments = function(commentsObj) {
    this._elem.innerHTML = commentsListTemplate(commentsObj);
};

CommentManager.prototype._onClick = function(e) {
    var elem = e.target;
    this._addComment(elem);
};

CommentManager.prototype._addComment = function(elem) {
    if (elem.classList.contains('add_comment')) {
        this._showCommentForm();
    }
};

CommentManager.prototype._showCommentForm = function(commentText) {
    document.body.insertAdjacentHTML('afterBegin', commentFormTemplate(commentText));
    var commentForm = document.body.firstElementChild;
    var mainElem = this._elem;

    function closeForm() {
        if (preventBubbling) {
            preventBubbling = false;
            return;
        }
        document.removeEventListener('click', onDocumentClick);
        commentForm.removeEventListener('click',onFormClick);
        document.body.removeChild(commentForm);
    }

    function onDocumentClick(e) {
        var elem = e.target;
        if(!commentForm.contains(elem)) {
            closeForm();
        }
    }

    function onFormClick(e) {
        var elem = e.target;
        if (elem.classList.contains('ok_btn')) {
            submitCommentForm();
        } else if (elem.classList.contains('cancel_btn')) {
            closeForm();
        }
    }

    function submitCommentForm() {
        var commentText = commentForm.querySelector('.comment_text').value;
        if (commentText.trim() === '') {
            commentForm.querySelector('.comment_text').value = '';
            alert('Введите текст комментария.');
        } else {
            var eventData = { commentText: commentText };
            var event = new CustomEvent('commentAdded', {
                bubbles: true,
                detail: eventData
            });

            mainElem.dispatchEvent(event);
            closeForm();
        }
    }

    var preventBubbling = true;

    commentForm.addEventListener('click',onFormClick);
    document.addEventListener('click', onDocumentClick);
};

module.exports = CommentManager;