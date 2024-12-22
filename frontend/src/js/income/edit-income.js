import { HttpUtils } from "../utils/http-utils";

export class EditIncome {
   constructor(openNewRoute) {
//вычлиняем из строки запроса id и title
      this.openNewRoute = openNewRoute;
   
      const urlParams = new URLSearchParams(window.location.search);
      this.id = urlParams.get('id');
      if (!this.id) {
         return this.openNewRoute('/');
      }

      this.title = urlParams.get('title');
    
      this.inputElement = document.getElementById('editIncomesCategory');
      document.getElementById('editIncomesCategoryBtn').addEventListener('click', this.editCategory.bind(this));  


      this.showValue()


   }

   showValue() {
      if(this.inputElement){
  this.inputElement.value = this.title

      }
    
   }



   validateForm() {
      let isValid = true;
      if (this.inputElement.value) {
         this.inputElement.classList.remove('is-invalid');
      } else {
         this.inputElement.classList.add('is-invalid');
         isValid = false;
      }
      return isValid;
   }



   async editCategory(e) {
      e.preventDefault();
      if (this.validateForm()) {
         const result = await HttpUtils.request('/categories/income/' + this.id, 'PUT', true, {
            title: this.inputElement.value
         });
         console.log(result)
   
         if (result.redirect) {
            return this.openNewRoute(result.redirect);
         }
         if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
           alert('Возникла ошибка редактировании категории дохода');
           return 
         }
         return this.openNewRoute('/incomes'); 
      }
   }
}

