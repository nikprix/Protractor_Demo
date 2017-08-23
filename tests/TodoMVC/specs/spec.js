var TodosPage = require('../page_objects/todo.js');
var Lorem = require('../../Util/lorem.js');

describe('Todos empty form validation', function () {
    var todosPage;

    // checking in full screen
    //browser.manage().window().maximize();

    // DEBUG
    //afterEach(function () {
    //    browser.manage().logs().get('browser').then(function (browserLog) {
    //        expect(browserLog.length).toEqual(0);
    //        if (browserLog.length) {
    //            console.error('log: ' + JSON.stringify(browserLog));
    //        }
    //    });
    //});

    beforeEach(function () {
        // explicity saying that the site we test is Angular
        isAngularSite(true);

        todosPage = new TodosPage();

        todosPage.to();
        todosPage.at();

    });

    it('Validate ToDo form\'s width in full screen: 550px', function(){

        // NOTE, below two methods are fixing VERY ODD issue with Angular not being recognized on the page
        // THIS NEEDS TO  BE REFACTORED, and fixed in BEFOREEACH methods!!! since something wrong is there!!!

        todosPage.to();
        todosPage.at();

        todosPage.todoFormField.getSize().then(function(elementSize){
            expect(elementSize.width).toEqual(550);
        });
    });

    it('Todos page title validation', function () {
        var title = 'AngularJS • TodoMVC';
        expect(todosPage.title).toEqual(title);
    });

    it('Todos page header validation', function () {
        var header = 'todos';
        expect(todosPage.header.getText()).toEqual(header);
    });

    it('Checking that form has no todo notes added', function () {

        //clearing caches and local storage
        todosPage.clearSession();
        // refreshing page
        browser.refresh();

        var hiddenClass = 'ng-hide';
        // check that section main has class hide
        expect(todosPage.currentMainSectionClass).toMatch(hiddenClass);
        // check that <footer> has class hide
        expect(todosPage.currentFooterSectionClass).toMatch(hiddenClass);
    });

    it('Check if form field has placeholder', function () {
        var placeholder = 'What needs to be done?';

        todosPage.todoFormField.getAttribute('placeholder').then(function (element) {
            expect(element).toEqual(placeholder);
        });
    });
});

describe('Todos form UI validation with 1 added item', function () {

    // checking in full screen
    browser.manage().window().maximize();

    var todosPage;

    beforeEach(function () {
        // explicity saying that the site we test is Angular
        isAngularSite(true);

        todosPage = new TodosPage();

        todosPage.to();
        todosPage.at();
    });

    it('Check if empty Todo can be created', function () {
        var emptyTodos = ['', '     '],
            hiddenClass = 'ng-hide';

        for (var i = 0; i < 2; i++) {
            // try to add Todo
            todosPage.todoFormField.sendKeys(emptyTodos[i], protractor.Key.ENTER);

            // validate if Todo was created or not
            expect(todosPage.currentMainSectionClass).toMatch(hiddenClass);
            expect(todosPage.currentFooterSectionClass).toMatch(hiddenClass);

        }
    });

    it('Add 1st ToDo and check that value is added', function () {

        // Adding Todo
        var firstToDo = 'Do something here!';
        todosPage.addTodo(firstToDo);

        // Validating added Todo
        todosPage.getTodosTexts().then(function (todo) {
            expect(todo[0]).toEqual(firstToDo);
        });
    });

    it('Check footer\'s counter label', function () {
        var counterSingle = 'item left';
        var counterPlural = 'items left';

        // check counter text with single Todo item
        expect(todosPage.todoCounterText.getText()).toEqual(counterSingle);

        // check counter text with multiple Todo items
        // add one more Todo
        var firstToDo = 'Do something here!';
        todosPage.addTodo(firstToDo);
        expect(todosPage.todoCounterText.getText()).toEqual(counterPlural);

        // remove one Todo
        // mark top item completed to hightlight 'x' button
        todosPage.markSingleToDoCompleted(0);
        todosPage.removeSingleToDo(0);
    });

    it('Check that ToDo form\'s input field has checkbox on the left', function () {
        expect(todosPage.checkAllTodosCheckbox.isEnabled()).toBe(true);
    });

    it('Check that entered ToDo item has checkbox/radio button on the left and it\'s not selected', function () {
        // checking if checkbox is present
        todosPage.allTodoCompletedCheckboxes.then(function (Todos) {
            expect(Todos.length).toBe(1);
            expect(Todos[0].isEnabled()).toBe(true);
        });
        // checking if this checkbox is not selected
        var uncheckedTodoClass = 'ng-scope';

        // todosPage.checkAllTodosCheckbox.click(); // ------ Validate this case by clicking checkbox

        todosPage.allAddedTodosList.then(function (todos) {
            todos[0].getAttribute('class').then(function (className) {
                expect(className).toMatch(uncheckedTodoClass);
            });
        });

    });

    it('check that section main has NO class hide and footer has NO class hide', function () {
        var hiddenClass = 'ng-hide';
        // check that section main has class hide
        expect(todosPage.currentMainSectionClass).not.toMatch(hiddenClass);
        // check that <footer> has class hide
        expect(todosPage.currentFooterSectionClass).not.toMatch(hiddenClass);
    });

    it('check that footer has ToDo count = 1 "1 item left" ', function () {
        expect(todosPage.todoCounter.getText()).toEqual('1');
    });

    it('check that footer has 3 options All/Active/Completed', function () {
        var filtersArray = ['All', 'Active', 'Completed'];
        // Debug values:
        /*
         todosPage.filters.each(function (element, index) {
         element.getText().then(function (text) {
         console.log(index, text);
         });
         });
         */
        // check count 1st
        expect(todosPage.filters.count()).toBe(3);
        // check labels at second
        expect(todosPage.filters.getText()).toEqual(filtersArray);
    });

    it('check that "All" option is selected by default', function () {
        var selectedClass = 'selected';
        expect(todosPage.allSectionFilterClass).toEqual(selectedClass);
    });

});

describe('Todos form functioning validation with 1 item', function () {

    // checking in full screen
    browser.manage().window().maximize();

    var todosPage;

    beforeEach(function () {
        // explicity saying that the site we test is Angular
        isAngularSite(true);

        todosPage = new TodosPage();

        todosPage.to();
        todosPage.at();
    });

    it('Check if double clicking on the added ToDos item edits it', function () {
        // Double click on Todo item to edit it
        todosPage.allAddedTodosList.then(function (todos) {
            browser.actions().doubleClick(todos[0]).perform();
        });

        // Check that Todo items class is 'ng-scope editing'
        var editedClass = 'ng-scope editing';
        todosPage.allAddedTodosList.then(function (todos) {
            todos[0].getAttribute('class').then(function (className) {
                expect(className).toMatch(editedClass);
            });
        });
    });

    it('Edit ToDo item in Active state and check if it saved correctly', function () {
        // Edit Todo item and Save
        todosPage.editTodo();
        // Save
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        // Check saved value
        var newtodo = 'Do something here! 123';
        expect(todosPage.firstTodoLabel.getText()).toEqual(newtodo);
    });

    it('Edit ToDo item in Completed/Crossed state and check if it saved correctly', function () {
        // Mark Todo item complete
        todosPage.markSingleToDoCompleted(0);

        // Edit Todo
        todosPage.allAddedTodosList.then(function (todos) {
            browser.actions().doubleClick(todos[0]).perform();
        });
        todosPage.editTodo();
        // Save
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        // Check saved value
        var newtodo = 'Do something here! 123 123';
        expect(todosPage.firstTodoLabel.getText()).toEqual(newtodo);

        // Check item is still completed
        var competedClass = 'ng-scope completed';
        todosPage.allAddedTodosList.then(function (todos) {
            todos[0].getAttribute('class').then(function (className) {
                expect(className).toMatch(competedClass);
            });
        });

    });

    it('Check if "x" appears when hovering over added todo item', function () {
        /* check when hovering over Active Todo */
        // marking Todo active
        todosPage.markSingleToDoActive(0);
        // hover over todo
        browser.actions().mouseMove(todosPage.firstRemoveButton).perform();
        // browser.actions().mouseMove(todosPage.header).perform(); // ---------- to test faulty case
        // Validate for Active todo
        expect(todosPage.firstRemoveButton.isDisplayed()).toBeTruthy();

        /* check when hovering over Completed Todo */
        // marking Todo completed
        todosPage.markSingleToDoCompleted(0);
        // hover over todo
        browser.actions().mouseMove(todosPage.firstRemoveButton).perform();
        // Validate for Completed todo
        expect(todosPage.firstRemoveButton.isDisplayed()).toBeTruthy();
    });

    it('Verify if clicking on tick in ToDos input field marks ToDo item completed', function () {
        // marking Todo active
        todosPage.markSingleToDoActive(0);
        // click on the tick to mark single Todo completed
        todosPage.markAllToDoCompleted();
        // check if Todo became completed
        var competedClass = 'ng-scope completed';
        todosPage.allAddedTodosList.then(function (todos) {
            todos[0].getAttribute('class').then(function (className) {
                expect(className).toMatch(competedClass);
            });
        });
        // check that item counter is 0
        expect(todosPage.todoCounter.getText()).toEqual('0');
        // check that 'clear completed' button loaded
        var EC = protractor.ExpectedConditions;
        var completed = todosPage.clearCompletedButton;
        browser.wait(EC.visibilityOf(completed), 1000).then(function () {
            expect(todosPage.clearCompletedButton.isDisplayed()).toBeTruthy();
        });
        //expect(todosPage.clearCompletedButton.isDisplayed()).toBeTruthy(); // --- other simpler option

        // mark Todo active again
        todosPage.markSingleToDoActive(0);
    });

    it('Verify if clicking on radio button from ToDo item marks it completed', function () {
        // marking Todo completed
        todosPage.markSingleToDoCompleted(0);
        // check if Todo became completed
        var competedClass = 'ng-scope completed';
        todosPage.allAddedTodosList.then(function (todos) {
            todos[0].getAttribute('class').then(function (className) {
                expect(className).toMatch(competedClass);
            });
        });
        // mark Todo active again
        todosPage.markSingleToDoActive(0);
    });

    it('Check if there are no Todos in "Completed" items', function () {
        // switch to Completed
        todosPage.completedSection.click();
        // check that Todo item is hidden
        expect(todosPage.allAddedTodos.isPresent()).toBeFalsy();
        // switch to All back
        todosPage.allSection.click();
        // check that ToDo item loaded back
        expect(todosPage.allAddedTodos.isPresent()).toBeTruthy();
    });

    it('Check if "Active" has the same single ToDo item as in "All"', function () {
        // get Todos text
        var todosPromiseFromAll = todosPage.getTodosTexts().then(function (todo) {
            return todo[0];
        });
        // switch to the Active section
        todosPage.activeSection.click();
        // get Todos text
        var todosPromiseFromActive = todosPage.getTodosTexts().then(function (todo) {
            return todo[0];
        });
        // compare
        todosPromiseFromActive.then(function (todosTextFromActive) {
            expect(todosPromiseFromAll).toEqual(todosTextFromActive);
        });

    });

    it('Check that completed ToDo item is not present in "Active" section', function () {
        // mark active Todo completed
        todosPage.markSingleToDoCompleted(0);
        // switch to the Active section
        todosPage.activeSection.click();
        // check if "Active" section became empty
        // check that completed Todo item is hidden
        expect(todosPage.allAddedTodos.isPresent()).toBeFalsy();
    });

    it('Check that completed item is present in "Completed"', function () {
        // switch to Completed section
        todosPage.completedSection.click();
        // check that completed Todo item is NOT hidden
        expect(todosPage.allAddedTodos.isPresent()).toBeTruthy();
    });

    it('Clear completed Todo item while in All section', function () {

        /* Clearing in All section */
        // switch to All section
        todosPage.allSection.click();
        // click Clear Completed
        todosPage.clearCompletedToDo();
        // assert if All section is empty
        expect(todosPage.allAddedTodos.isPresent()).toBeFalsy();
    });

    it('Clear completed Todo item while in Active section', function () {

        var todoText = 'Do something here again! -> Active section';
        /* Clearing in Active section */
        // add Todo
        todosPage.addTodo(todoText);
        // mark Todo Completed
        todosPage.markSingleToDoCompleted(0);
        // switch to Active
        todosPage.activeSection.click();
        // click Clear Completed
        todosPage.clearCompletedToDo();
        // assert if All section is empty
        expect(todosPage.allAddedTodos.isPresent()).toBeFalsy();
    });

    it('Check that after removing all OR last Todo item in "Active" section - ' +
        '"All" section is selected when adding new Todo', function () {

        var todoText = 'Do something here again! -> Check default section';
        // add Todo
        todosPage.addTodo(todoText);
        // assert if All section is selected
        var selectedClass = 'selected';
        expect(todosPage.allSectionFilterClass).toEqual(selectedClass);
    });

    it('Clear completed Todo item while in Completed section', function () {

        // switch to All section ----- to avoid failures since this Todo form has bug with resetting to "All" after
        // clearing last Todo
        todosPage.allSection.click();
        // mark Todo Completed
        todosPage.markSingleToDoCompleted(0);
        // switch to Completed
        todosPage.completedSection.click();
        // click Clear Completed
        todosPage.clearCompletedToDo();
        // assert if All section is empty
        expect(todosPage.allAddedTodos.isPresent()).toBeFalsy();
    });

    it('Check that after removing all OR last Todo item in "Completed" section - ' +
        '"All" section is selected when adding new Todo', function () {

        var todoText = 'Do something here again! -> Check default section again';
        // add Todo
        todosPage.addTodo(todoText);
        // assert if All section is selected
        var selectedClass = 'selected';
        expect(todosPage.allSectionFilterClass).toEqual(selectedClass);
    });

    it('Remove added Active todo item by clicking on "x" from "Active" section', function () {
        // switch to Active section
        todosPage.activeSection.click();
        // remove Todo
        todosPage.removeSingleToDo(0);
        // assert
        expect(todosPage.allAddedTodos.isPresent()).toBeFalsy();
    });

    it('Remove added and Completed todo item by clicking on "x" from Completed section', function () {
        // Add Todo
        var todoText = 'Do something here again! -> Todo to Complete and Remove';
        todosPage.addTodo(todoText);
        // Make completed
        todosPage.markSingleToDoCompleted(0);
        // switch to Completed section
        todosPage.completedSection.click();
        // remove Todo
        todosPage.removeSingleToDo(0);
        // assert
        expect(todosPage.allAddedTodos.isPresent()).toBeFalsy();
    });
});

describe('Multiple added Todos validation', function () {

    // checking in full screen
    browser.manage().window().maximize();

    var todosPage;

    beforeEach(function () {
        // explicity saying that the site we test is Angular
        isAngularSite(true);

        todosPage = new TodosPage();

        todosPage.to();
        todosPage.at();
    });

    it('Check if "Active" has the same amount of uncompleted ToDo items as in "All"', function () {

        var newTodoText = 'Todo text example - ';
        // add 5 Todos
        var x = 1;
        while (x <= 5) {
            todosPage.addTodo(newTodoText + x);
            x++;
        }
        // Switch to All section
        todosPage.allSection.click();
        // mark 2 Todos completed
        todosPage.markSingleToDoCompleted(1);
        todosPage.markSingleToDoCompleted(3);
        // check counter
        expect(todosPage.todoCounter.getText()).toEqual('3');
        // remember Amount on uncompleted Todos
        var unCompleted = 3;
        // switch to Active
        todosPage.activeSection.click();
        // get amount of Active/uncompleted Todos and match to amount from All
        expect(todosPage.todoListParent.all(by.className('ng-scope')).count()).toBe(unCompleted);
        // check that todos counter is not changed
        expect(todosPage.todoCounter.getText()).toEqual('3');
    });

    it('Check if "Completed" has the same amount of completed ToDo items as in "All"', function () {
        // switch to All
        todosPage.allSection.click();
        // mark 1 more Todo completed
        todosPage.markSingleToDoCompleted(0);
        // check counter
        expect(todosPage.todoCounter.getText()).toEqual('2');
        // remember Amount of completed Todos
        var completed = 3;
        // switch to Active
        todosPage.completedSection.click();
        // get amount of Completed Todos and match to amount from All
        expect(todosPage.todoListParent.all(by.className('ng-scope completed')).count()).toBe(completed);
        // check that todos counter is not changed
        expect(todosPage.todoCounter.getText()).toEqual('2');
    });

    it('Add todos while in "Completed" section', function () {
        // remember amount of completed Todos
        var completed = todosPage.allAddedTodosList.then(function (elems) {
            return elems.length;
        });
        // remember amount of uncompleted Todos (switch to Active to count)
        todosPage.activeSection.click();
        var unCompleted = todosPage.allAddedTodosList.then(function (elems) {
            return elems.length;
        });
        // add Active todo in Completed section
        var newTodo = 'New Todo Added while in Completed Section';
        todosPage.completedSection.click();
        todosPage.addTodo(newTodo);

        // check counter (resolve promises at first)
        unCompleted.then(function (unCompletedCount) {
            todosPage.todoCounter.getText().then(function (text) {
                expect(parseFloat(text)).toEqual(unCompletedCount + 1);
            });
        });
        // check that amount of completed todos is not changed in Completed section
        completed.then(function (completedCount) {
            expect(todosPage.todoListParent.all(by.className('ng-scope completed')).count()).toBe(completedCount);
        });

        // check that Active section has +1 todo
        todosPage.activeSection.click();

        unCompleted.then(function (unCompletedCount) {
            expect(todosPage.todoListParent.all(by.className('ng-scope')).count()).toBe(unCompletedCount + 1);
        });
    });
});

describe('Performance testing', function () {

    // checking in full screen
    browser.manage().window().maximize();

    var todosPage;
    var lorem;

    beforeEach(function () {
        // explicity saying that the site we test is Angular
        isAngularSite(true);

        todosPage = new TodosPage();

        todosPage.to();
        todosPage.at();
    });

    it('Add todo item with large text', function () {
        // test with an empty form
        todosPage.clearAllRefresh();

        var largeTodo = lorem.generateLoremIpsum(99, 100, 'lorem');
        console.log('generate TODO: ' + largeTodo);
        // add large Todo
        todosPage.addTodo(largeTodo);
        // Assert
        expect(todosPage.firstTodoLabel.getText()).toEqual(largeTodo);
    });

    it('Add large amount of todos', function () {
        // test with an empty form
        todosPage.clearAllRefresh();
        // add 20 Todos - can be configured below
        todosPage.addMultipleTodos(20, lorem.generateLoremIpsum(15, 100, 'lorem'));
        // switch to All
        todosPage.allSection.click();
        // validate the amount of saved Todos
        expect(todosPage.allAddedTodosList.count()).toEqual(20);
    });

    it('Check if form vertically resizes accordingly and can be scrolled', function () {
        // test with an empty form
        todosPage.clearAllRefresh();
        // add 20 Todos with the same text
        var todoText = 'The same text for Todo to calculate offset in the browser after the test';
        todosPage.addMultipleTodos(20, todoText);
        // switch to All
        todosPage.allSection.click();
        // scroll to the bottom
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight);');
        // getting offset and comparing with expected
        // Offest is approximate depending from the screen, where test run
        browser.executeScript('return window.pageYOffset;').then(function (pos) {
            expect(pos).not.toBeLessThan(1200);
        });
    });

    it('Remove large amount of todos with "x button', function () {
        // scroll up
        browser.executeScript('window.scrollTo(0,0);');
        // mark top item completed to hightlight 'x' button
        todosPage.markSingleToDoCompleted(0);
        // remove Todos one by one
        todosPage.removeToDoButtons.each(function () {
            todosPage.removeSingleToDo(0);
        });
        // assert empty form
        expect(todosPage.allAddedTodos.isPresent()).toBeFalsy();
    });

    it('Make large amount of todos completed', function () {
        // add 20 Todos - can be configured below
        todosPage.addMultipleTodos(20, lorem.generateLoremIpsum(15, 100, 'lorem'));
        // switch to All
        todosPage.allSection.click();
        // mark all todos completed
        todosPage.markAllToDoCompleted();
        // count completed Todos and assert
        expect(todosPage.todoListParent.all(by.className('ng-scope completed')).count()).toBe(20);
    });

    it('Validate if all added Todos are kept in memory after closing page', function () {
        // load other website in the same tab
        browser.get('https://angularjs.org/');
        // load form's URL again
        browser.get('http://todomvc.com/examples/angularjs/#/');
        // check amount of Todos
        expect(todosPage.todoListParent.all(by.className('ng-scope completed')).count()).toBe(20);
    });
});

describe('Todos form testing for handling International char\'s handling', function () {

    // checking in full screen
    browser.manage().window().maximize();

    var todosPage;
    var lorem;

    beforeEach(function () {

        // explicity saying that the site we test is Angular
        isAngularSite(true);

        todosPage = new TodosPage();

        todosPage.to();
        todosPage.at();

        todosPage.clearAllRefresh();
        lorem = new Lorem();
    });

    it('Add todo with international & special chars', function () {
        // Add Todo
        var intTodo = lorem.generateLoremIpsum(4, 5, 'int');
        todosPage.addTodo(intTodo);
        // Check if added Todo is being saved and displayed correctly
        todosPage.getTodosTexts().then(function (todo) {
            expect(todo[0]).toEqual(intTodo);
        });
    });
});