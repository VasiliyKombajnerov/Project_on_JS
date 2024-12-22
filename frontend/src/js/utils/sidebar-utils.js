export class Sidebar {
   constructor() {
       this.sidebarElement = document.getElementById('sidebar');
       this.sidebarTogglerElement = document.getElementById('sidebar_toggler');
       
       if (this.sidebarTogglerElement && this.sidebarElement) {
           this.sidebarTogglerElement.addEventListener('click', this.toggleSidebar.bind(this));
       }
   }

   toggleSidebar() {
       this.sidebarElement.classList.toggle('show');
       this.sidebarTogglerElement.classList.toggle('nav-open');
   }

   
}

