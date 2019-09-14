export default (id, name, action) => {
  let form = `<form class="comment__form comment__form-${action}" style="display: none;">
                <div class="info comment__form-top">
                  <div class="info__small"><span class="info__author-reply"><i class="info__icon icon-share-alt"></i>${name}</span></div>
                  <div class="info__small"><button class="btn__transparent comment__form-close"><i class="btn__icon icon-remove"></i>Cancel</button></div>
                </div>
                <textarea class="comment__form-textarea" name="content" placeholder="Your  Message"></textarea>
                <div class="comment__form-bottom">
                  ${action === 'edit' ? '<input name="_method" type="hidden" value="PUT">' : ''}
                  <input name="parent" type="hidden" value="${id}">
                  <input name="parentName" type="hidden" value="${name}">
                  <button class="btn__primary comment__form-btn" type="submit">Send</button>
                </div>
            </form>`;
  form = $(form);
  return form;
}