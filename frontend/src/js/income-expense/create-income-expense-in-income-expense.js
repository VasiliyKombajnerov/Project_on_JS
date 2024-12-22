import { HttpUtils } from "../utils/http-utils";

export class CreateIncomeExpenseInIncomeExpense {
   constructor(openNewRoute, type) {
       this.openNewRoute = openNewRoute;
       this.expenseOperation = null;
       this.typeSelectElement = document.getElementById('type-select');
       this.categorySelectElement = document.getElementById('category');
       this.sumElement = document.getElementById('sum');
       this.dateElement = document.getElementById('date');
       this.commentElement = document.getElementById('comment');
       this.getCategories(type).then();

       this.typeSelectElement.addEventListener('change', () => {
           this.showCategories(this.operation);
       })

       document.getElementById('create-button').addEventListener('click', this.saveOperation.bind(this));
   }


async getCategories(type) {
   try {
       const result = await HttpUtils.request(`/categories/${type}`);
       
       // Проверка на ошибки в результате
       if (result.error || !result.response) {
           throw new Error('Не удалось загрузить категории. Попробуйте еще раз.');
       }

       this.operation = result.response;
    //    console.log(this.operation)
       this.showCategories(this.operation);
       this.showOption(type);
   } catch (error) {
       console.error('Ошибка при получении категорий:', error);
       alert(error.message || 'Произошла ошибка при загрузке категорий. Обратитесь в поддержку.');
   }
}

   showOption(type) {
       const optionElement = document.createElement('option');
       optionElement.setAttribute('value', type);
       optionElement.setAttribute('selected', 'selected')
       optionElement.innerText = type === 'income' ? 'Доход' : 'Расход';
       this.typeSelectElement.appendChild(optionElement);
       this.showCategories(this.operation)
   }

   showCategories(operation) {
       for (let i = 0; i < operation.length; i++) {
         const optionElement = document.createElement('option');
            optionElement.setAttribute("value", operation[i].id);
            optionElement.innerText = operation[i].title;
            this.categorySelectElement.appendChild(optionElement);
       }

   }


   validateForm() {
       let isValid = true;
       let textInputArray = [
           this.typeSelectElement,
           this.categorySelectElement,
           this.sumElement,
           this.dateElement,
           this.commentElement
       ]
       for (let i = 0; i < textInputArray.length; i++) {
           if (textInputArray[i].value) {
               textInputArray[i].classList.remove('is-invalid');
           } else {
               textInputArray[i].classList.add('is-invalid');
               isValid = false
           }
       }
       return isValid;
   }

   async saveOperation(e) {
       e.preventDefault();
       if (this.validateForm()) {
           const result = await HttpUtils.request('/operations', 'POST', true, {
               type: this.typeSelectElement.value,
               amount: this.sumElement.value,
               date: this.dateElement.value,
               comment: this.commentElement.value,
               category_id: Number(this.categorySelectElement.value)
           });
           if (result.redirect) {
               return this.openNewRoute(result.redirect);
           }

           if (result.error || !result.response || (result.response && result.response.error)) {
               console.log(result.response.message);
                alert('Возникла ошибка при запросе категорий');
                return
           }
           return this.openNewRoute('/incomes-expenses');
       }
   }


}