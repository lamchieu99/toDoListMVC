
model = {
	items: []
}

view = {

	clearList: () => {
		let element = document.querySelector(".list__todo");
		if (element) {
			element.parentNode.removeChild(element);
		}
	},

	showForm: () => {

		let elemenForm = document.querySelector(".form__todo");
		if (elemenForm) {
			elemenForm.parentNode.removeChild(elemenForm);
		}

		list = document.querySelector(".app")
		appToDo = document.createElement('div')
		formItem = document.createElement('form');
		inputItem = document.createElement('input');
		iconToggle = document.createElement('i');

		appToDo.className = "app__todo"
		formItem.className = "form__todo"
		inputItem.className = 'form__input-add';

		inputItem.type = 'text';
		inputItem.placeholder = 'What needs to be done?'
		inputItem.setAttribute("onkeypress", "view.addToDo(event)")

		formItem.appendChild(inputItem);
		appToDo.appendChild(formItem);
		list.appendChild(appToDo);
	},

	showFooter: () => {

		list = document.querySelector(".app")

		eleFooter = document.createElement('footer')
		footerCount = document.createElement('span')
		todoCount = document.createElement('strong')
		footerFilters = document.createElement('ul');
		liFiters = document.createElement('li');
		filtersAll = document.createElement('a');
		filtersActive = document.createElement('a');
		filtersCompleted = document.createElement('a');
		clearCompleted = document.createElement('a');

		eleFooter.className = "footer app__footer";
		footerCount.className = "footer__count";
		todoCount.className = "todo__count";
		footerFilters.className = "footer__filters";
		liFiters.className = "li__filters";
		filtersAll.className = "filters--all";
		filtersActive.className = "filters--active";
		filtersCompleted.className = "filters--completed";
		clearCompleted.className = "footer__clear--completed";

		filtersAll.textContent = "All";
		filtersActive.textContent = "Active";
		filtersCompleted.textContent = "Completed";
		clearCompleted.textContent = "Clear completed";

		filtersAll.href = "#"
		filtersActive.href = "#/active";
		filtersCompleted.href = "#/completed";

		filtersAll.setAttribute("onclick", "controller.filterByStatus('all')");
		filtersActive.setAttribute("onclick", "controller.filterByStatus('active')");
		filtersCompleted.setAttribute("onclick", "controller.filterByStatus('completed')");
		clearCompleted.setAttribute("onclick", "controller.clearCompleted()");

		footerCount.appendChild(todoCount);
		eleFooter.appendChild(footerCount);
		liFiters.appendChild(filtersAll);
		liFiters.appendChild(filtersActive);
		liFiters.appendChild(filtersCompleted);
		footerFilters.appendChild(liFiters);
		eleFooter.appendChild(footerFilters);
		eleFooter.appendChild(clearCompleted);
		list.appendChild(eleFooter);

	},

	renderListToDo: () => {
		view.clearList();

		//Select count
		let count = document.querySelector('.todo__count');
		if (model.items.length > 1) {
			count.innerHTML = (model.items.length + ' ' + 'items left');
		}
		else {
			count.innerHTML = (model.items.length + ' ' + 'item left');
		}

		//Create item
		if (model.items.length != 0) {

			list = document.querySelector(".app__todo")
			listToDo = document.createElement('ul');
			listToDo.className = "list__todo"

			list.appendChild(listToDo);
			for (let i = model.items.length - 1; i >= 0; i--) {
				liItem = document.createElement('li');
				divItem = document.createElement('div');
				pItem = document.createElement('label');
				inputItem = document.createElement('input');
				iconCheck = document.createElement('i')
				iconCross = document.createElement('i');

				liItem.className = "list__todo-item"
				iconCheck.className = "item--complete"
				pItem.className = " list__item-text"
				iconCross.className = "item--delete"
				divItem.className = "list__item-view"

				pItem.textContent = model.items[i].text

				iconCheck.setAttribute("class", "list__icon--check")
				iconCheck.setAttribute("data-index", i)
				iconCross.setAttribute("class", "list__icon--trash icon ion-md-trash")
				iconCross.setAttribute("data-index", i)

				iconCheck.setAttribute("onclick", "controller.completeToDo(event)")
				iconCross.setAttribute("onclick", "controller.deleteToDo(event)")

				if (model.items[i].completed) {
					iconCheck.setAttribute("class", "list__icon--checked")
					liItem.setAttribute("class", "list__todo-item item--completed")
				}

				divItem.appendChild(iconCheck);
				divItem.appendChild(pItem);
				divItem.appendChild(iconCross);
				liItem.appendChild(divItem);
				listToDo.appendChild(liItem);
				list.appendChild(listToDo);

			}
		}
	},


	localStorage: () => {
		let dataString = localStorage.getItem('todoList');
		if (dataString) {
			model.items = JSON.parse(dataString);
		}
		else {
			model.items = [];
		}
	},

	addToDo: (e) => {
		if ((e.code == "Enter") || (e.code == "NumpadEnter")) {
			let text = document.querySelector(".form__input-add").value;
			if ((text != "")) {
				controller.addToDo(text);
			}
		}
	},

	clearCompleted: () => {
		controller.filterByStatus()
	}
}

controller = {
	init: () => {
		view.showForm();
		view.showFooter();
		view.localStorage();
		localStorage.setItem('todoList', JSON.stringify(model.items));
		controller.filterByStatus();
		view.renderListToDo();
	},

	addToDo: (item) => {
		view.localStorage();
		let list_todo = { text: item, completed: false };
		model.items.push(list_todo);
		document.querySelector(".form__input-add").value = "";
		localStorage.setItem('todoList', JSON.stringify(model.items));
		view.renderListToDo();

	},

	completeToDo: (e) => {
		view.localStorage();
		let index = e.target.getAttribute("data-index");
		model.items[index].completed = !model.items[index].completed;
		localStorage.setItem('todoList', JSON.stringify(model.items));
		view.renderListToDo();
	},

	deleteToDo: (e) => {
		view.localStorage();
		let index = e.target.getAttribute("data-index");
		model.items.splice(index, 1);
		localStorage.setItem('todoList', JSON.stringify(model.items));
		view.renderListToDo();
	},

	filterByStatus: (status = '') => {
		switch (status) {
			case 'active':
				{
					view.localStorage();
					model.items = model.items.filter(todo => !todo.completed);
					view.renderListToDo();
					break;
				}
			case 'completed':
				{
					view.localStorage();
					model.items = model.items.filter(todo => todo.completed);
					view.renderListToDo();
					break;
				}
			default:
				view.localStorage();
				model.items;
				view.renderListToDo();
		}
	},

	clearCompleted: () => {
		view.localStorage();
		model.items = controller.filterByStatus('active');
		// model.items = controller.filterByStatus('');
		// view.renderListToDo();
	}
}

controller.init();