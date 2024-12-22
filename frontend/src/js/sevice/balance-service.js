import { HttpUtils } from "../utils/http-utils";

export class BalanceService{
   constructor(openNewRoute){
      this.openNewRoute = openNewRoute;
      if(BalanceService.instance) {
         return BalanceService.instance
      }
      BalanceService.instance = this; 
   }
   #balanceValue = 0;
   get balance(){
      return this.#balanceValue;
   }
   async requestBalance(){
          const result = await HttpUtils.request('/balance')
      if (result.redirect) {
         return this.openNewRoute(result.redirect);
      }
      if (result.error || !result.response || (result.response && result.response.error)) {
         return console.log('Возникла ошибка при запросе Баланса. Обратитесь в поддержку ')
      }
      this.#balanceValue = result.response.balance;
      console.log(`Баланс обновлён: ${this.#balanceValue}`);
   }
   async updateBalance(newBalance) {
      const result = await HttpUtils.request('/balance', 'PUT', true, {
         newBalance: newBalance
      });

      if (result.redirect) {
         return this.openNewRoute(result.redirect);
      }

      if (result.error || !result.response || (result.response && result.response.error)) {
         console.log('Возникла ошибка при обновлении Баланса. Обратитесь в поддержку');
         return;
      }

      // Обновление внутреннего значения баланса
      this.#balanceValue = result.response.balance;
      console.log(`Баланс обновлён: ${this.#balanceValue}`);
      return result
   }
}