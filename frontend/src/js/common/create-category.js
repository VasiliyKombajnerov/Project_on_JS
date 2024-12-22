
import { HttpUtils } from "../utils/http-utils";
import { CategoryDeleter } from "./delete-category";

export class CreateCategory {
   constructor(openNewRoute, categoryType) {
      this.openNewRoute = openNewRoute;
      this.categoryType = categoryType;
      this.getCategories().then();
   }

   async getCategories() {
      const result = await HttpUtils.request(`/categories/${this.categoryType}`);

      if (result.redirect) {
         return this.openNewRoute(result.redirect);
      }

      if (result.error || !result.response || (result.response && result.response.error)) {
         console.log(result.response.message || 'Возникла ошибка при запросе. Обратитесь в поддержку');
         return;
      }

      this.getCategoryList(result.response);
   }

   getCategoryList(categories) {
      let cardsElement = document.getElementById('cards');

      if (cardsElement) {
         cardsElement.innerHTML = "";
         categories.forEach(category => {
            let cardElement = this.createCategoryCard(category);
            cardsElement.appendChild(cardElement);
         });
      }

      this.addNewCardLink(cardsElement);
      this.categoryDeleteEventListeners();
   }

   createCategoryCard(category) {
      let cardElement = document.createElement('div');
      cardElement.className = 'col-md-4 mb-4';
      cardElement.innerHTML = `
           <div class="card h3 p-3 text-purple-dark">
               ${category.title}
               <div class="action pt-3">
                   <a href="/edit-${this.categoryType}?id=${category.id}&title=${category.title}" class="btn btn-primary">Редактировать</a>
                   <a href="javascript:void(0)" class="delete-card btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal"
                   data-id="${category.id}" data-title="${category.title}">Удалить</a>
               </div>
           </div>
       `;
      return cardElement;
   }

   addNewCardLink(cardsElement) {
      const cardLinkElement = document.createElement('div');
      cardLinkElement.className = 'col-md-4 mb-4';
      cardLinkElement.innerHTML = `
       <div class="card new-card  h3 p-3 text-purple-dark d-flex  justify-content-center align-items-center">
                         <a href="/create-${this.categoryType}" class="text-center text-decoration-none">
               <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z" fill="#CED4DA"/>
                </svg>
        </a>
          
       </div>
   `;

      cardsElement.appendChild(cardLinkElement);

      cardLinkElement.addEventListener('click', (event) => {
         if (event.target.closest('.new-card')) {
            window.location.href = `/create-${this.categoryType}`;
         }
      });
   }

   // categoryDeleteEventListeners() {
   //          document.addEventListener('click', (event) => {
   //       if (event.target.classList.contains('delete-card')) {
   //          const categoryId = event.target.getAttribute('data-id');
   //          const categoryTitle = event.target.getAttribute('data-title');
   //          const deleteBtn = document.getElementById('delete-btn');

   //          deleteBtn.addEventListener('click', (e) => {
   //             e.preventDefault();
   //             CategoryDeleter.deleteCategory(this.categoryType, categoryId, categoryTitle, this.openNewRoute);
   //          });
   //       }
   //    });
   // }
   categoryDeleteEventListeners() {
      const deleteBtn = document.getElementById('delete-btn');
  
      // Обработчик для кнопки удаления
      deleteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const categoryId = deleteBtn.getAttribute('data-id');
          const categoryTitle = deleteBtn.getAttribute('data-title');
          CategoryDeleter.deleteCategory(this.categoryType, categoryId, categoryTitle, this.openNewRoute);
      });
  
      // Обработчик для клика на карточку удаления
      document.addEventListener('click', (event) => {
          if (event.target.classList.contains('delete-card')) {
              const categoryId = event.target.getAttribute('data-id');
              const categoryTitle = event.target.getAttribute('data-title');
  
              // Устанавливаем данные для кнопки удаления
              deleteBtn.setAttribute('data-id', categoryId);
              deleteBtn.setAttribute('data-title', categoryTitle);
          }
      });
  }
}

