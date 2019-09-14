import $ from 'jquery';

window.$ = $;
window.jQuery = $;

import svg4everybody from 'svg4everybody';

import request from './comments-request';
import serializeForm from './serialize-form';
import commentsCreate from './comments-create';
import commentForm from './comment-form';

const initComments = $commentsSection => {
  const $commentsBlock = $commentsSection.find('.comments-block');
  const COMMENTS_COUNT = 5; // when opening page
  const LOAD_MORE_COUNT = 5;
  const USER_ID = 1;
  let commentsOffset = 0;
  let $commentsList;

  getComments();

  $commentsSection.on('click', '.loadmore__btn', getMoreComments);

  $commentsSection.on('submit', '.comment__form-new', addNewComment);

  $commentsSection.on('submit', '.comment__form-reply', addReplyComment);

  $commentsSection.on('submit', '.comment__form-edit', editComment);

  $commentsSection.on('click', '.comment__form-open', formOpen);

  $commentsSection.on('click', '.comment__form-close', formClose);

  $commentsSection.on('click', '.comment__delete', commentDelete);

  function getComments() {
    request(
      'GET', { count: COMMENTS_COUNT, offset: commentsOffset }
    ).done(data => {
      if (data.length) {
        const comments = commentsCreate(data, USER_ID);

        $commentsList = $('<ul/>', { class: 'comments__list', html: comments }).appendTo($commentsBlock);
        $commentsList.find('.comment').slideDown();
        commentsOffset = commentsOffset + COMMENTS_COUNT;
      } else {
        $commentsBlock.html('No comments yet.');
      }
    }).fail(() => {
      console.log('get comments list failed');
    });
  }

  function getMoreComments() {
    request(
      'GET', {count: LOAD_MORE_COUNT, offset: commentsOffset}
    ).done(data => {
      if (data.length) {
        const comments = commentsCreate(data, USER_ID);

        $commentsList.append(comments);
        $commentsList.find('.comment[style="display: none"]').slideDown();
        commentsOffset = commentsOffset + data.length;
      } else {
        $('.loadmore__btn').prop({ disabled: true }).html('No comments more');
      }
    }).fail(() => {
      console.log('get comments list failed');
    });
  }

  function addNewComment(e) {
    e.preventDefault();
    const $form = $(this);
    const params = serializeForm($form);

    request(
      'POST', params
    ).done(data => {
      const comment = commentsCreate([data], USER_ID);
      $commentsList.prepend(comment);
      $commentsList.find('.comment[style="display: none"]').slideDown();
      ++commentsOffset;
    }).fail(() => {
      console.log('new failed');
    });
  }

  function addReplyComment(e) {
    e.preventDefault();
    const $form = $(this);
    const parentComment = $form.closest('.comment');
    const params = serializeForm($form);
    const parentName = params.parentName;

    request(
      'POST', params
    ).done(data => {
      const comment = commentsCreate([data], USER_ID, parentName);
      const parentContent = parentComment.find('.comment__content');
      const active = parentComment.find('.comment__form-open[disabled]');
      let childrenList = parentComment.find('.comments__list-children');

      if (childrenList.length) {
        childrenList.append(comment);
      } else {
        childrenList = $('<ul/>', { class: 'comments__list-children', html: comment });
        childrenList.appendTo(parentContent)
      }

      childrenList.find('.comment[style="display: none"]').slideDown();
      active.prop({disabled: false});
      $form.slideUp(() => $form.remove());
    }).fail(() => {
      console.log('reply failed');
    });
  }

  function editComment(e) {
    e.preventDefault();
    const $form = $(this);
    let params = serializeForm($form);

    request(
      'POST', params, params.parent
    ).done(data => {
      const $comment = $(commentsCreate([data], USER_ID));
      const $edited = $commentsList.find('#' + params.parent);
      const $editedChildren = $edited.find('.comments__list-children');

      if ($editedChildren.length) {
        $comment.find('.comment__content').append($editedChildren);
      }

      $edited.replaceWith(() => $comment.fadeIn());
    }).fail(() => {
      console.log('edit failed');
    });
  }

  function formOpen() {
    const $this = $(this);
    const action = $this.data('action');
    const $control = $this.parent('.comment__control');
    const $oldForm = $control.next('.comment__form');
    const {id, name} = $control.data('control');
    const $newForm = commentForm(id, name, action);
    const textarea = $newForm.find('.comment__form-textarea[name="content"]');

    const setFocus = () => {
      if (action === 'edit') {
        const text = $control.prev('.comment__text').text();
        const strLength = text.length * 2;

        textarea.val(text);
        textarea.trigger("focus");
        textarea[0].setSelectionRange(strLength, strLength);
      } else {
        textarea.trigger("focus");
      }
    };

    if ($oldForm.length) {
      $oldForm.replaceWith($newForm);
      $newForm.fadeIn(setFocus);
    } else {
      $control.after($newForm);
      $newForm.slideDown(setFocus);
    }

    $control.find('.comment__form-open[disabled]').prop({disabled: false});
    $this.prop({disabled: true});
  }

  function formClose() {
    const $this = $(this);
    const $form = $this.closest('.comment__form');
    const $openBtn = $this.closest('.comment').find('.comment__form-open[disabled]');

    $form.slideUp(() => {
      $form.remove();
      $openBtn.prop({disabled: false});
    });
  }

  function commentDelete() {
    const $this = $(this);
    const comment = $this.closest('.comment');
    const commentId = comment.attr('id');
    const commentParent = $this.closest('.comments__list-children');

    request(
      'POST', { _method: 'DELETE' }, commentId
    ).done(() => {
      console.log('delete success');
      comment.slideUp(() => comment.remove());

      if (!commentParent.length) {
        commentsOffset -= 1;
      }
    }).fail(() => {
      console.log('delete failed');
    });
  }
};

$(document).ready(() => {
  svg4everybody();

  console.log('start');

  const $commentsSection = $('#comments-section');

  if ($commentsSection.length) {
    initComments($commentsSection);
  }

});