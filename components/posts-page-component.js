import { LIKE_POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { addLikeApi, dislikeLikeApi } from "../api.js";
//import { ru } from "date-fns/locale";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const appHtml = posts.map((post, index) => {
    const renderLikeCounter =
      post.likes.length > 1
        ? post.likes[0].name + "и еще " + (post.likes.length - 1)
        : post.likes.length === 0
        ? 0
        : post.likes[0].name;

    //const createdTimeToNow = formatDistanceToNow(new Date(post.createdAt), {
    //locale: ru,
    //});
    return `

              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  <li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${
                          post.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${index}" data-post-isLiked="${
      post.isLiked
    }" 
    class="like-button">
                        ${
                          post.isLiked
                            ? "<img src='./assets/images/like-active.svg'></img>"
                            : "<img src='./assets/images/like-not-active.svg'></img>"
                        }
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${renderLikeCounter}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      
                    </p>
                  </li>
                </ul>
              </div>`;
  });
  appEl.innerHTML = appHtml;
  const index = renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeButtonElement of document.querySelectorAll(".like-button")) {
    likeButtonElement.addEventListener("click", () => {
      let index = likeButtonElement.dataset.postId;
      let likeStatus = posts[index].isLiked;
      console.log(likeStatus);
      if (getToken()) {
        if (likeStatus) {
          dislikeLikeApi({
            posts: posts,
            index: index,
          }).then(() => {
            goToPage(LIKE_POSTS_PAGE);
          });
        }
        if (!likeStatus) {
          addLikeApi({
            posts: posts,
            index: index,
          }).then(() => {
            goToPage(LIKE_POSTS_PAGE);
          });
        }
      } else {
        alert("Лайкать посты могут только автризованные пользователи");
      }
    });
  }
}
