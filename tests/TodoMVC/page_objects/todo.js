/* todo.js - Todos page object */

var basePage = require('../../Util/basePage.js');

var TodosPage = function () {

    // ***** properties *****

    this.url = '/examples/angularjs/#/';

    // Header
    this.title = browser.getTitle();
    this.header = element(by.xpath('//*[@id="header"]/h1'));

    this.todoFormField = element(by.model('newTodo'));

    // Main
    this.todoListParent = element(by.id('todo-list'));
    this.allAddedTodosList = element.all(by.repeater('todo in todos'));
    this.allAddedTodos = element(by.css('#todo-list li'));
    this.firstTodoLabel = element(by.xpath('//*[@id="todo-list"]/li/div/label'));
    this.allTodoCompletedCheckboxes = element.all(by.model('todo.completed'));
    this.checkAllTodosCheckbox = element(by.model('allChecked'));
    this.removeToDoButtons = element.all(by.css('li .destroy'));
    this.mainSection = element(by.id('main'));
    this.currentMainSectionClass = this.mainSection.getAttribute('class');
    this.firstRemoveButton = element(by.xpath('//*[@id="todo-list"]/li/div/button'));

    // Footer
    this.footerSection = element(by.id('footer'));
    this.currentFooterSectionClass = this.footerSection.getAttribute('class');
    this.todoCounter = element(by.xpath('//*[@id="todo-count"]/strong'));
    this.todoCounterText = element(by.xpath('//*[@id="todo-count"]/ng-pluralize'));
    this.filters = element.all(by.css('#filters li a'));
    this.allSectionFilterClass = element(by.xpath('//*[@id="filters"]/li[1]/a')).getAttribute('class');
    this.clearCompletedButton = element(by.id('clear-completed'));
    this.allSection = this.filters.get(0);
    this.activeSection = this.filters.get(1);
    this.completedSection = this.filters.get(2);

    // ***** functions *****

    // validating page load with single even:
    this.pageLoaded = function () {
        return this.isVisible(this.header);
    };

    this.markSingleToDoCompleted = function (index) {
        this.allTodoCompletedCheckboxes.get(index).click();
    };

    this.markAllToDoCompleted = function () {
        this.checkAllTodosCheckbox.click();
    };

    this.markSingleToDoActive = function (index) {
        this.allTodoCompletedCheckboxes.get(index).click();
    };

    this.markAllToDoActive = function () {
        this.checkAllTodosCheckbox.click();
    };

    this.removeSingleToDo = function (index) {
        this.removeToDoButtons.get(index).click();
    };

    this.clearCompletedToDo = function () {
        this.clearCompletedButton.click();
    };

    this.clearSession = function () {
        browser.executeScript('window.sessionStorage.clear();');
        //browser.executeScript("localStorage.removeItem('todos-angularjs');");
        //browser.executeScript('if (localStorage.getItem("todos-angularjs") !== null) \{ localStorage.removeItem(key); \}');
        browser.executeScript('window.localStorage.clear();');
    };

    this.clearAllRefresh = function () {
        this.clearSession();
        browser.refresh();
    };

    // Returns promise which gets Todos' text
    this.getTodosTexts = function () {
        return this.allAddedTodosList.map(function (Todos) {
            return Todos.getText();
        });
    };

    this.addTodo = function (todoText) {
        this.todoFormField.sendKeys(todoText, protractor.Key.ENTER);
    };

    this.addMultipleTodos = function (amount, todoText) {
        var x = 1;
        while (x <= amount) {
            this.addTodo(todoText);
            x++;
        }
    };

    this.editTodo = function () {
        browser.actions()
            .sendKeys(protractor.Key.SPACE).perform();
        browser.actions()
            .sendKeys(protractor.Key.NUMPAD1).perform();
        browser.actions()
            .sendKeys(protractor.Key.NUMPAD2).perform();
        browser.actions()
            .sendKeys(protractor.Key.NUMPAD3).perform();
    };

};

TodosPage.prototype = basePage; // extend basePage...
module.exports = TodosPage;