import { Form } from "./js/auth/form";
import { MainChart } from "./js/chart/mainChart";
import { CreateCategory } from "./js/common/create-category";
import { Layout } from "./js/common/layout";
import { CreateExpense } from "./js/expense/create-expense";
import { EditExpense } from "./js/expense/edit-expense";

import { CreateExpenseInIncomeExpense, CreateIncomeExpenseInIncomeExpense } from "./js/income-expense/create-income-expense-in-income-expense";
import { DeleteIncomeExpense } from "./js/income-expense/delete-income-expense";
import { EditIncomeExpense } from "./js/income-expense/edit-income-expense";
import { IncomeExpenses } from "./js/income-expense/income-expense";
import { CreateIncome } from "./js/income/create-income";
import { EditIncome } from "./js/income/edit-income";
import { AuthUtils } from "./js/utils/auth-utils";
import { HttpUtils } from "./js/utils/http-utils";
import { Sidebar } from "./js/utils/sidebar-utils";
import { BalanceService } from "./js/sevice/balance-service";



export class Router {
   constructor() {
      this.contentElement = document.getElementById('content');
      this.titlePageElement = document.getElementById('title-page');
      this.contentLayoutElement = null;
      this.headerTitleElem = null;
      this.layoutPath = '/templates/layout.html';
      this.balanceElem = null;

      this.routes = [
         {
            route: '/',
            title: 'Главная',
            template: '/templates/pages/mainChart.html',
            useLayout: this.layoutPath,
            load: () => {
               new MainChart(this.openNewRoute.bind(this));
            }
         },

         {
            route: '/login',
            title: 'Авторизация',
            template: '/templates/pages/auth/login.html',
            useLayout: false,
            load: () => {
               new Form(this.openNewRoute.bind(this), 'login');
            }
         },
         {
            route: '/sign-up',
            title: 'Регистрация',
            template: '/templates/pages/auth/sign-up.html',
            useLayout: false,
            load: () => {
               new Form(this.openNewRoute.bind(this), 'sign-up');
            }
         },

         {
            route: '/incomes-expenses',
            title: ' Доходы & Расходы',
            template: '/templates/pages/income-expense/incomes-expenses.html',
            useLayout: this.layoutPath,
            load: () => {
               new IncomeExpenses(this.openNewRoute.bind(this));
            },
         },
         {
            route: '/edit-income-expense',
            title: 'Редактирование дохода/расхода',
            template: '/templates/pages/income-expense/edit-income-expense.html',
            useLayout: this.layoutPath,
            load: () => {
               new EditIncomeExpense(this.openNewRoute.bind(this))
            }
         },
         {
            route: '/delete-income-expense',
            load: () => {
               new DeleteIncomeExpense(this.openNewRoute.bind(this))
            }
         },
         {
            route: '/expenses',
            title: 'Расходы',
            template: '/templates/pages/expense/expenses.html',
            useLayout: this.layoutPath,
            load: () => {
               new CreateCategory(this.openNewRoute.bind(this), 'expense')
            },

         },
         {
            route: '/create-expense',
            title: 'Создание категории расходов',
            template: '/templates/pages/expense/create-expenses-category.html',
            useLayout: this.layoutPath,
            load: () => {
               new CreateExpense(this.openNewRoute.bind(this))
            }
         },
         {
            route: '/edit-expense',
            title: 'Редактирование расхода',
            template: '/templates/pages/expense/edit-expenses-category.html',
            useLayout: this.layoutPath,
            load: () => {
               new EditExpense(this.openNewRoute.bind(this))
            }
         },
             {
            route: '/incomes',
            title: ' Доходы',
            template: '/templates/pages/income/incomes.html',
            useLayout: this.layoutPath,
            load: () => {
               new CreateCategory(this.openNewRoute.bind(this), 'income')
            }
         },
         {
            route: '/create-income',
            title: ' Создание категории доходов',
            template: '/templates/pages/income/create-incomes-category.html',
            useLayout: this.layoutPath,
            load: () => {
               new CreateIncome(this.openNewRoute.bind(this))
            }
         },
         {
            route: '/edit-income',
            title: 'Редактирование дохода',
            template: '/templates/pages/income/edit-incomes-categoty.html',
            useLayout: this.layoutPath,
            load: () => {
               new EditIncome(this.openNewRoute.bind(this))
            }
         },
         {
            route: '/create-expense-in-income-expense',
            title: 'Создание дохода/расхода',
            template: '/templates/pages/income-expense/create-income-expense.html',
            useLayout: this.layoutPath,
            load: () => {
               new CreateIncomeExpenseInIncomeExpense(this.openNewRoute.bind(this), 'expense')
            }
         },
   
         {
            route: '/create-income-in-income-expense',
            title: 'Создание дохода/расхода',
            template: '/templates/pages/income-expense/create-income-expense.html',
            useLayout: this.layoutPath,
            load: () => {
               new CreateIncomeExpenseInIncomeExpense(this.openNewRoute.bind(this), 'income')
            }
         },
      

      ]
      this.initEvents();
   }
   initEvents() {
      window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
      window.addEventListener('popstate', this.activateRoute.bind(this));
      document.addEventListener('click', this.clickHandler.bind(this));
   }

   async openNewRoute(url) {
      const currentRoute = window.location.pathname;
      history.pushState({}, '', url);
      await this.activateRoute(null, currentRoute)
   }


   async clickHandler(e) {
      let element = null
      if (e.target.nodeName === 'A') {
         element = e.target
      } else if (e.target.parentNode.nodeName === 'A') {
         element = e.target.parentNode
      }


      if (element) {
         e.preventDefault()
         const currentRoute = window.location.pathname;
         const url = element.href.replace(window.location.origin, '')
         if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
            return;
         }

         await this.openNewRoute(url)
      }
   }

   async activateRoute() {

      const urlRoute = window.location.pathname;
      const newRoute = this.routes.find(item => item.route === urlRoute); // это обект с данными маршрута

      if (newRoute) {
         if (newRoute.title) {
            this.titlePageElement.innerText = newRoute.title + ' |  Lumincoin Finance'
         }


         if (newRoute.template) {
            // this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
         
            if (newRoute.useLayout) {
               // new Layout(newRoute);
            
               this.contentElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())
               this.contentLayoutElement = document.getElementById('content-layout');
               this.userNameElement = document.getElementById('userName');
               this.logOutElement = document.getElementById('logOut');
               this.headerTitleElem = document.getElementById('header-title');
               this.headerTitleElem.innerText = newRoute.title;
               this.balanceElem = document.getElementById('balance-amount');
               new Sidebar();

               let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
               if (userInfo) {
                  userInfo = JSON.parse(userInfo)
                  if (userInfo.name) {
                     this.userNameElement.innerText = userInfo.name + ' ' + userInfo.lastName
                  }
               } else {
                  location.href = '/login'
               }
               // обработадла выход из приложения
               this.logOutElement.addEventListener('click', (e) => {
                  e.preventDefault();
                  AuthUtils.removeAuthInfo();
                  location.href = '/login'
               })
             this.setBalance().then()
               this.activateLink('.main-menu-item');
               let menuDropdownLink = document.getElementById('menu-dropdown-link');
               if (menuDropdownLink) {
                  menuDropdownLink.addEventListener('click', (e) => {
                     e.preventDefault();
                     menuDropdownLink.classList.add('active');
                     this.activateLink('.menu-dropdown-item');


                  })

               }

               this.contentLayoutElement.innerHTML = await fetch(newRoute.template).then(response => response.text());

            }else {
               // Если useLayout false, загружаем только шаблон
               this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
          
           }

         }

         if (newRoute.load && typeof newRoute.load === 'function') {
            newRoute.load();
       
         }

      } 
      // else {
      //    console.log("route not found")
      //    history.pushState({}, '', '/login');
     
      //    await this.activateRoute();
      // }

      else {
         console.log("route not found");
         // Проверяем, если пользователь уже на странице входа
         if (urlRoute !== '/login') {
            history.pushState({}, '', '/login');

         }
      //    // Здесь можно добавить логику для отображения страницы ошибки или уведомления
      }
   }



   async setBalance() {
      const balanceService = new BalanceService(this.openNewRoute.bind(this)); 
      await balanceService.requestBalance(); // Запросите баланс
      this.balanceElem.innerText = `${balanceService.balance}$`; 
  }

   activateLink(elemClass) {
      let currentlocation = window.location.pathname;
      let menuLinks = document.querySelectorAll(elemClass);
      menuLinks.forEach((link) => {
         let linkHref = link.getAttribute('href');
         if (linkHref === currentlocation) {
            link.classList.add('active');

         } else {
            link.classList.remove('active');
         }

      })
   }


}
