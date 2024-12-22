import { HttpUtils } from "../utils/http-utils";

export class CreateExpense {
   constructor(openNewRoute) {
       this.openNewRoute = openNewRoute;

       this.inputElement = document.getElementById('createExpensesCategory');
       document.getElementById('createExpensesCategoryBtn').addEventListener('click', this.saveCategory.bind(this));
   }

   validateForm(){
       let isValid = true;
       if(this.inputElement.value){
           this.inputElement.classList.remove('is-invalid');
       } else {
           this.inputElement.classList.add('is-invalid');
           isValid = false;
       }
       return isValid;
   }

   async saveCategory(e){
       e.preventDefault();
       if(this.validateForm()){
           const result = await HttpUtils.request('/categories/expense', 'POST', true, {
               title: this.inputElement.value
           });

           if(result.redirect) {
               return this.openNewRoute(result.redirect);
           }
           if (result.error || !result.response || (result.response && result.response.error)) {
               console.log(result.response.message);
               return alert('Возникла ошибка добавлении категории расхода');
           }
           alert(`Категория ${this.inputElement.value} успешно добавлена`)
           return this.openNewRoute('/expenses');
       }
   }
}