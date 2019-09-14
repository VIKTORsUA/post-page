export default (data, USER_ID, replyName = false) => {
  const commentControls = (replyName, replyId, USER_ID, authorId) => {
    const reply = JSON.stringify({"id": replyId, "name": replyName});
    const userControls = `<button class="btn btn__transparent comment__form-open" data-action="edit">
                            <i class="btn__icon icon-edit"></i>
                            <span>Edit</span>
                          </button>
                          <button class="btn btn__transparent comment__delete">
                            <i class="btn__icon icon-remove"></i>
                            <span>Delete</span>
                          </button>`;

    return `<div class="info info__small comment__control" data-control='${reply}'>
              ${USER_ID === authorId ? userControls : ''}
              <button class="btn btn__transparent comment__form-open" data-action="reply">
                <i class="btn__icon icon-reply"></i>
                <span>Reply</span>
              </button>
            </div>`;
  };

  // TODO: I could use a moment.js
  const formatDate = dateString => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let day = date.getDate();
    if (day < 10) day = '0' + day;
    let hours = date.getHours();
    if (hours < 10) hours = '0' + hours;
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;

    return `<time datetime="${dateString}"><b>${year}-${month}-${day}</b> at <b>${hours}:${minutes}</b></time>`
  };

  const commentDate = (created, updated) => {
    if (created === updated) {
      return `<span class="info__small"><i class="info__icon icon-time"></i>${formatDate(created)}</span>`
    }
    return `<span class="info__small"><i class="info__icon icon-time"></i>${formatDate(created)}, edited ${formatDate(updated)}</span>`
  };

  const createComments = (data, USER_ID, replyName = false, ulClass = false) => {
    const comments = data.map(comment => {
      const {id, created_at, updated_at, parent, children, content, author: {id: authorId, avatar, name}} = comment;
      const date = commentDate(created_at, updated_at);

      return `<li id="${id}" class="comment" ${ulClass ? '' : 'style="display: none"'}>
                <div class="comment__avatar-wrap"><img class="comment__avatar" src="${avatar}" alt="${name}"></div>
                <div class="comment__content">
                  <div class="info comment__info">
                    <b class="info__author">${name}</b>
                    ${replyName ? `<span class="info__author-reply"><i class="icon-share-alt"></i> ${replyName}</span>` : ''}
                    ${date}
                  </div>
                  <div class="comment__text">${content}</div>
                  ${children || parent === null ? commentControls(name, id, USER_ID, authorId) : ''}
                  ${children && children.length ? createComments(children, USER_ID, name, '-children') : ''}
                </div>
              </li>`;
    });

    return ulClass ? `<ul class="comments__list${ulClass}">${comments.join('')}</ul>` : comments.join('')
  };

  return createComments(data, USER_ID, replyName);
}