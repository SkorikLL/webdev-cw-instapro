import { POSTS_PAGE } from "../routes.js";
import { goToPage } from "../index.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { addPostAPI } from "../api.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
        <div class="page-header">
          <h1 class="logo">instapro</h1>
          <button class="header-button add-or-login-button">
          <div title="Добавить пост" class="add-post-sign"></div>
      </button>
      <button title="Админ" class="header-button logout-button">Выйти</button>  
    </div>
</div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
  <div class="upload=image">
      
            <label class="file-upload-label secondary-button">
                <input type="file" class="file-upload-input" style="display:none">
                Выберите фото
            </label>
          
      
  </div>
</div>
          <label>
            Опишите фотографию:
            <textarea id="textarea" class="input textarea" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    //Функция добавления фотографий
    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.querySelector(".logo").addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const inputDescriptionElementContent =
        document.getElementById("textarea").value;
      if (!inputDescriptionElementContent & !imageUrl) {
        alert("Добавьте описания и фотографию!");
        return;
      } else if (!inputDescriptionElementContent) {
        alert("Нужно описать фотографию.");
        return;
      } else if (!imageUrl) {
        alert("Нужно добавить фотографию.");
        return;
      } else {
        onAddPostClick({
          description: inputDescriptionElementContent,
          imageUrl: imageUrl,
        });

        //Добавляем новый пост пользователя в API (POST метод)
        addPostAPI({
          description: inputDescriptionElementContent
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;"),
          imageUrl: imageUrl,
        });
        goToPage(POSTS_PAGE);
      }
    });
  };

  render();
}
