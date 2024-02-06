// Замени на свой, чтобы получить независимый от других набор данных.

import { getToken } from "../index.js";

// "боевая" версия инстапро лежит в ключе prod
const personalKey = "leonid-skorik";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

//Получаем посты пользователя из API
export function getPostsUser({ token, data }) {
  return fetch(postsHost + "/user-posts/" + `${data.userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

//Добавляем новый пост пользователя в API (POST метод)
export function addPostAPI({ description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({
      description,
      imageUrl,
    }),
    headers: {
      Authorization: getToken(),
    },
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("В теле запроса не передан description или imageUrl");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

//Добавляем Like (POST метод)
export function addLikeApi({ posts, index }) {
  return fetch(postsHost + `/${posts[index].id}` + "/like", {
    method: "POST",
    body: JSON.stringify({
      likes: { id: posts[index].user.id, name: posts[index].user.name },
      isLiked: posts.isLiked,
    }),
    headers: {
      Authorization: getToken(),
    },
  }).then((response) => {
    return response.json();
  });
}

//Удаляем Like (POST метод)
export function dislikeLikeApi({ posts, index }) {
  return fetch(postsHost + `/${posts[index].id}` + "/dislike", {
    method: "POST",
    body: JSON.stringify({
      likes: { id: posts[index].user.id, name: posts[index].user.name },
      isLiked: posts.isLiked,
    }),
    headers: {
      Authorization: getToken(),
    },
  }).then((response) => {
    return response.json();
  });
}
