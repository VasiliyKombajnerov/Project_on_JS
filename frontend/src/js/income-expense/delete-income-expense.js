import { HttpUtils } from "../utils/http-utils";

export class DeleteIncomeExpense {
   constructor(openNewRoute) {
       this.openNewRoute = openNewRoute;
       let urlParams = new URLSearchParams(window.location.search); //находим нужный id
       let id = urlParams.get('id');
       if(!id){
           return this.openNewRoute('/');
       }
       this.deleteOperation(id).then();

   }

   async deleteOperation(id){ //удаляем операцию
       let result = await HttpUtils.request('/operations/' + id, 'DELETE', true);
       if(result.redirect){
           return this.openNewRoute(result.redirect);
       }

       if (result.error || !result.response || (result.response && result.response.error)) {
           console.log(result.response.message);
           return console.log('Возникла ошибка при удалении операции');
       }
       return this.openNewRoute('/incomes-expenses');
   }
}