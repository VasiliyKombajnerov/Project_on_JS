// import { AuthUtils } from "../utils/auth-utils";
// import { HttpUtils } from "../utils/http-utils";

// export class Layout {
//    constructor(newRoute) {
//       this.newRoute = newRoute;
//        this.contentElement = document.getElementById('content'); // Предполагается, что у вас есть элемент с id 'content'
//        this.contentLayoutElement = document.getElementById('content-layout');
//        this.userNameElement = document.getElementById('userName');
//        this.logOutElement = document.getElementById('logOut');
//        this.headerTitleElem = document.getElementById('header-title');
//        this.balanceElem = document.getElementById('balance-amount');
//        this.init(newRoute).then()
//    }

//    async init(newRoute) {
//        this.contentElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());

//        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
//        if (userInfo) {
//            userInfo = JSON.parse(userInfo);
//            if (userInfo.name) {
//                this.userNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
//            }
//        } else {
//            location.href = '/login';
//        }

//        this.logOutElement.addEventListener('click', (e) => {
//            e.preventDefault();
//            AuthUtils.removeAuthInfo();
//            location.href = '/login';
//        });

//       //  this.getBalance().then();

//        this.activateLink('.main-menu-item');
//        let menuDropdownLink = document.getElementById('menu-dropdown-link');
//        if (menuDropdownLink) {
//            menuDropdownLink.addEventListener('click', (e) => {
//                e.preventDefault();
//                menuDropdownLink.classList.add('active');
//                this.activateLink('.menu-dropdown-item');
//            });
//        }

//        this.contentLayoutElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
//    }
   // async getBalance() {
   //    const result = await HttpUtils.request('/balance')
   //    if (result.redirect) {
   //       return this.openNewRoute(result.redirect);
   //    }
   //    if (result.error || !result.response || (result.response && result.response.error)) {
   //       return console.log('Возникла ошибка при запросе Баланса. Обратитесь в поддержку ')
   //    }

   //    this.balanceElem.innerText = result.response.balance + '$';
   //    // // создать функцию обновления баланса
   //    // updatehBalance().then();

   // }
   
   // Другие методы класса Layout

//    activateLink(elemClass) {
//       let currentlocation = window.location.pathname;
//       let menuLinks = document.querySelectorAll(elemClass);
//       menuLinks.forEach((link) => {
//          let linkHref = link.getAttribute('href');
//          if (linkHref === currentlocation) {
//             link.classList.add('active');

//          } else {
//             link.classList.remove('active');
//          }

//       })
//    }
// }