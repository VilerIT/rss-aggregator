import onChange from 'on-change';

import { handleViewPost, handleCloseModal } from './handlers.js';

const buildPosts = (state, posts, i18nInstance) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = `<h2>${i18nInstance.t('posts')}</h2>`;

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach((post) => {
    const isViewed = state.uiState.viewedPostsIds.includes(post.id);

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    li.dataset.id = post.id;

    li.innerHTML = `
    <a href="${post.url}" class="${isViewed ? 'font-weight-normal' : 'font-weight-bold'}" target="_blank" rel="noopener noreferrer">
      ${post.title}
    </a>
    <button type="button" class="btn btn-primary btn-sm">${i18nInstance.t('buttons.view')}</button>
    `;

    const a = li.querySelector('a');
    const button = li.querySelector('button');

    a.addEventListener('click', () => {
      if (!isViewed) {
        state.uiState.viewedPostsIds.push(post.id);
      }
    });

    button.addEventListener('click', () => {
      if (!isViewed) {
        state.uiState.viewedPostsIds.push(post.id);
      }

      handleViewPost(post);
    });

    ul.append(li);
  });

  postsContainer.append(ul);
};

const buildFeeds = (feeds, i18nInstance) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = `<h2>${i18nInstance.t('feeds')}</h2>`;

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.dataset.id = feed.id;

    li.innerHTML = `
    <h3>${feed.title}</h3>
    <p>${feed.desc}</p>
    `;

    ul.append(li);
  });

  feedsContainer.append(ul);
};

const render = (state, i18nInstance) => {
  if (state.feeds.length > 0) {
    buildFeeds(state.feeds, i18nInstance);
    buildPosts(state, state.posts, i18nInstance);
  }

  const fullArticleButton = document.querySelector('.full-article');
  const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');

  fullArticleButton.textContent = i18nInstance.t('buttons.readArticle');
  closeButtons[1].textContent = i18nInstance.t('buttons.close');

  closeButtons.forEach((closeButton) => {
    closeButton.addEventListener('click', handleCloseModal);
  });
};

export default (state, i18nInstance) => {
  const submitButton = document.querySelector('[type="submit"]');
  const input = document.querySelector('.form-control');
  const feedback = document.querySelector('.feedback');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.state') {
      switch (value) {
        case 'filling':
          // submitButton.disabled = false;
          // input.disabled = false;
          break;
        case 'pending':
          // submitButton.disabled = true;
          // input.disabled = true;
          break;
        default:
          throw new Error(`Unexpected state: ${value}`);
      }
    } else if (path === 'form.error') {
      feedback.textContent = '';
      if (value) {
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
        feedback.textContent = state.form.error;
      } else {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
      }
    } else if (path === 'form.isSuccess') {
      feedback.textContent = '';
      if (value) {
        feedback.classList.add('text-success');
        feedback.textContent = i18nInstance.t('success');
      } else {
        feedback.classList.remove('text-success');
      }
    } else if (path === 'lang') {
      if (state.form.error) {
        feedback.textContent = state.form.error;
      } else if (state.form.isSuccess) {
        feedback.textContent = i18nInstance.t('success');
      }
    } else {
      render(watchedState, i18nInstance);
    }
  });

  return watchedState;
};
