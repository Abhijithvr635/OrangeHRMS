// /// <reference types="cypress" />

// describe('OrangeHRM Employee Test', () => {
//   it('adds an employee and verifies it exists in the table', () => {
//     // Visit login page
//     cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

//     // Login
//     cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input')
//       .type('Admin');
//     cy.get('input[name="password"]').type('admin123');
//     cy.get('button[type="submit"]').click({ force: true });

//     // Click on PIM
//     cy.contains('span', 'PIM').click({ force: true });

//     // Add Employee
//     cy.contains('a', 'Add Employee').click({ force: true });
//     cy.get('input[placeholder="First Name"]').type('Test', { force: true });
//     cy.get('input[placeholder="Last Name"]').type('Data', { force: true });

//     // Employee ID
//     cy.get('input.oxd-input').eq(4).clear({ force: true }).type('TEST2255', { force: true });

//     // Save
//     cy.get('button[type="submit"]').click({ force: true });

//     // Wait for possible loading spinner to disappear
//     cy.get('.oxd-loading-spinner', { timeout: 10000 }).should('not.exist');

//     // Navigate to Employee List
//     cy.contains('a', 'Employee List').click({ force: true });
//     cy.wait(2000);

//     // Search by Employee ID
//     cy.get(':nth-child(2) > .oxd-input').clear({ force: true }).type('TEST2255', { force: true });
//     cy.get('button[type="submit"]').click({ force: true });
//     cy.wait(2000);

//     // Assert that the employee ID exists in the results
//     cy.get('.oxd-table-body .oxd-table-card')
//       .first()
//       .contains('div', 'TEST2255')
//       .should('exist');

//       // Delete the employee using Actions column selector
//     cy.get('.oxd-table-body .oxd-table-card')
//       .first()
//       .find('.oxd-table-cell-actions > :nth-child(2) > .oxd-icon')
//       .click({ force: true });

//     // Confirm deletion in the popup
//     cy.get('button.oxd-button--label-danger').click({ force: true });

//     // Verify deletion by searching again
//     cy.get(':nth-child(2) > .oxd-input').clear({ force: true }).type('TEST2255', { force: true });
//     cy.get('button[type="submit"]').click({ force: true });
//     cy.wait(2000);

//     // Assert that the employee is no longer in the table
//     cy.get('.oxd-table-body').should('not.contain', 'TEST2255');
//   });
// });


// /// <reference types="cypress" />

// describe('OrangeHRM Employee Test - Add, Verify, Delete', () => {

//   // Generate random employee data
//   const randomString = (len = 5) =>
//     Array.from({ length: len }, () => Math.random().toString(36)[2]).join('');

//   it('adds a random employee, verifies, and deletes it', () => {
//     const firstName = 'Test' + randomString(3);
//     const lastName = 'User' + randomString(3);
//     const employeeID = 'EMP' + Math.floor(Math.random() * 100000);
//     cy.log(`Generated Employee: ${firstName} ${lastName} (${employeeID})`);

//     // Visit login page
//     cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { timeout: 120000 });

//     // Login
//     cy.get('input[name="username"]').type('Admin');
//     cy.get('input[name="password"]').type('admin123');
//     cy.get('button[type="submit"]').click({ force: true });

//     // Wait for Dashboard to load
//     cy.url().should('include', '/dashboard');

//     // Click on PIM
//     cy.contains('span', 'PIM').click({ force: true });

//     // Click Add Employee
//     cy.contains('a', 'Add Employee').click({ force: true });

//     // Fill Employee Details
//     cy.get('input[placeholder="First Name"]').type(firstName);
//     cy.get('input[placeholder="Last Name"]').type(lastName);

//     // Set Employee ID
//     cy.contains('label', 'Employee Id')
//       .parents('.oxd-input-group')
//       .find('input')
//       .clear()
//       .type(employeeID);

//     // Save
//     cy.get('button[type="submit"]').click({ force: true });

//     // Wait for save to complete
//     cy.get('.oxd-loading-spinner', { timeout: 10000 }).should('not.exist');

//     // Verify redirect
//     cy.url().should('include', '/pim/viewPersonalDetails');

//     // Navigate to Employee List
//     cy.contains('a', 'Employee List').click({ force: true });
//     cy.wait(2000);

//     // Search for Employee ID
//     cy.contains('label', 'Employee Id')
//       .parents('.oxd-input-group')
//       .find('input')
//       .clear()
//       .type(employeeID);

//     cy.get('button[type="submit"]').click({ force: true });
//     cy.wait(2000);

//     // Verify employee appears in table
//     cy.get('.oxd-table-body .oxd-table-card')
//       .first()
//       .should('contain.text', employeeID)
//       .and('contain.text', firstName);

//     // Delete the employee
//     cy.get('.oxd-table-body .oxd-table-card')
//       .first()
//       .find('.oxd-table-cell-actions > :nth-child(2) > .oxd-icon')
//       .click({ force: true });

//     // Confirm deletion
//     cy.get('button.oxd-button--label-danger').click({ force: true });

//     // Search again to confirm deletion
//     cy.contains('label', 'Employee Id')
//       .parents('.oxd-input-group')
//       .find('input')
//       .clear()
//       .type(employeeID);

//     cy.get('button[type="submit"]').click({ force: true });
//     cy.wait(2000);

//     // Verify record is gone
//     cy.get('.oxd-table-body').should('not.contain.text', employeeID);
//   });
// });


// /// <reference types="cypress" />

// describe('OrangeHRM Employee Test - Add, Verify, Delete (Step-based logging)', () => {

//   // Step counter & log helpers
//   let step = 0;

//   const logStep = (message) => {
//     step++;
//     const formatted = `🟡 STEP ${step}: ${message}`;
//     cy.log(formatted);
//     console.log(`%c${formatted}`, 'color: orange; font-weight: bold;');
//   };

//   const logSuccess = (message) => {
//     const formatted = `✅ STEP ${step} PASSED: ${message}`;
//     cy.log(formatted);
//     console.log(`%c${formatted}`, 'color: green; font-weight: bold;');
//   };

//   const logFail = (message) => {
//     const formatted = `❌ STEP ${step} FAILED: ${message}`;
//     cy.log(formatted);
//     console.error(`%c${formatted}`, 'color: red; font-weight: bold;');
//   };

//   // Utility for random data
//   const randomString = (len = 5) =>
//     Array.from({ length: len }, () => Math.random().toString(36)[2]).join('');

//   it('adds, verifies, and deletes a random employee', () => {
//     const firstName = 'Test' + randomString(3);
//     const lastName = 'User' + randomString(3);
//     const employeeID = 'EMP' + Math.floor(Math.random() * 100000);
//     console.log(`🆕 Employee Data: ${firstName} ${lastName} (${employeeID})`);

//     // STEP 1: Visit login page
//     logStep('Visiting OrangeHRM login page');
//     cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { timeout: 120000 });

//     // STEP 2: Login
//     logStep('Logging in with Admin credentials');
//     cy.get('input[name="username"]').type('Admin');
//     cy.get('input[name="password"]').type('admin123');
//     cy.get('button[type="submit"]').click({ force: true });
//     cy.url().should('include', '/dashboard')
//       .then(() => logSuccess('Successfully logged in and dashboard loaded'));

//     // STEP 3: Navigate to PIM
//     logStep('Navigating to PIM module');
//     cy.contains('span', 'PIM').click({ force: true });
//     cy.url().should('include', '/pim')
//       .then(() => logSuccess('PIM module opened successfully'));

//     // STEP 4: Add Employee
//     logStep('Opening Add Employee page');
//     cy.contains('a', 'Add Employee').click({ force: true });
//     cy.get('input[placeholder="First Name"]').type(firstName);
//     cy.get('input[placeholder="Last Name"]').type(lastName);
//     cy.contains('label', 'Employee Id')
//       .parents('.oxd-input-group')
//       .find('input')
//       .clear()
//       .type(employeeID);
//     cy.get('button[type="submit"]').click({ force: true });
//     cy.get('.oxd-loading-spinner', { timeout: 10000 }).should('not.exist');
//     cy.url().should('include', '/viewPersonalDetails')
//       .then(() => logSuccess(`Employee ${employeeID} added successfully`));

//     // STEP 5: Go to Employee List
//     logStep('Navigating to Employee List');
//     cy.contains('a', 'Employee List').click({ force: true });
//     cy.wait(2000);
//     cy.url().should('include', '/viewEmployeeList')
//       .then(() => logSuccess('Employee List page loaded successfully'));

//     // STEP 6: Search for the new Employee
//     logStep(`Searching for Employee ID: ${employeeID}`);
//     cy.contains('label', 'Employee Id')
//       .parents('.oxd-input-group')
//       .find('input')
//       .clear()
//       .type(employeeID);
//     cy.get('button[type="submit"]').click({ force: true });
//     cy.wait(2000);
//     cy.get('.oxd-table-body .oxd-table-card')
//       .first()
//       .should('contain.text', employeeID)
//       .and('contain.text', firstName)
//       .then(() => logSuccess(`Verified employee ${employeeID} exists in the table`));

//     // STEP 7: Delete the Employee
//     logStep('Deleting the employee');
//     cy.get('.oxd-table-body .oxd-table-card')
//       .first()
//       .find('.oxd-table-cell-actions > :nth-child(2) > .oxd-icon')
//       .click({ force: true });
//     cy.get('button.oxd-button--label-danger').click({ force: true });
//     cy.wait(2000);
//     cy.get('.oxd-loading-spinner', { timeout: 10000 }).should('not.exist');
//     cy.contains('label', 'Employee Id')
//       .parents('.oxd-input-group')
//       .find('input')
//       .clear()
//       .type(employeeID);
//     cy.get('button[type="submit"]').click({ force: true });
//     cy.wait(2000);
//     cy.get('.oxd-table-body').should('not.contain.text', employeeID)
//       .then(() => logSuccess(`Employee ${employeeID} deleted successfully`));

//     // STEP 8: Test Completion
//     logStep('Finalizing test');
//     cy.then(() => {
//       logSuccess('🎉 TEST COMPLETED SUCCESSFULLY: Employee added, verified, and deleted.');
//     });
//   });
// });

/// <reference types="cypress" />

describe('OrangeHRM Employee Test - Full Add/Verify/Delete with Row Count', () => {

  let step = 0;

  const logStep = (message) => {
    step++;
    const formatted = `🟡 STEP ${step}: ${message}`;
    cy.log(formatted);
    console.log(`%c${formatted}`, 'color: orange; font-weight: bold;');
  };

  const logSuccess = (message) => {
    const formatted = `✅ STEP ${step} PASSED: ${message}`;
    cy.log(formatted);
    console.log(`%c${formatted}`, 'color: green; font-weight: bold;');
  };

  const randomString = (len = 5) =>
    Array.from({ length: len }, () => Math.random().toString(36)[2]).join('');

  // Robust pagination-aware total row count
  function getTotalRowsFromPages() {
    let totalRows = 0;
    return cy.get('body').then($body => {
      const $pagination = $body.find('.oxd-pagination__ul li');
      if ($pagination.length) {
        // Multiple pages exist
        return cy.get('.oxd-pagination__ul li').each($page => {
          cy.wrap($page).click({ force: true });
          cy.wait(1000); // wait for table reload
          cy.get('.oxd-table-body .oxd-table-card').then($rows => {
            totalRows += $rows.length;
          });
        }).then(() => totalRows);
      } else {
        // Single page
        return cy.get('.oxd-table-body .oxd-table-card').then($rows => {
          totalRows += $rows.length;
          return totalRows;
        });
      }
    });
  }

  it('Adds, verifies, and deletes an employee with accurate row count', () => {
    const firstName = 'Test' + randomString(3);
    const lastName = 'User' + randomString(3);
    const employeeID = 'EMP' + Math.floor(Math.random() * 100000);

    // STEP 1: Login
    logStep('Logging in with Admin credentials');
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { timeout: 120000 });
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 300000 }).should('include', '/dashboard').then(() => logSuccess('Dashboard loaded'));

    // STEP 2: Navigate to Employee List
    logStep('Navigating to Employee List');
    cy.contains('span', 'PIM').click({ force: true });
    cy.contains('a', 'Employee List').click({ force: true });
    cy.url({ timeout: 15000 }).should('include', '/viewEmployeeList');

    // STEP 3: Count total rows before adding employee
    logStep('Counting total rows before adding employee');
    getTotalRowsFromPages().then(initialTotalRows => {
      cy.wrap(initialTotalRows).as('initialTotalRows');
      logSuccess(`Initial total rows: ${initialTotalRows}`);

      // STEP 4: Add Employee
      logStep('Adding a new employee');
      cy.contains('a', 'Add Employee').click({ force: true });
      cy.get('input[placeholder="First Name"]').type(firstName);
      cy.get('input[placeholder="Last Name"]').type(lastName);
      cy.get('input[placeholder="Middle Name"]').type('A'); // optional safe field
      cy.contains('label', 'Employee Id')
        .parents('.oxd-input-group')
        .find('input')
        .clear()
        .type(employeeID);

      cy.get('button[type="submit"]').click();
      cy.get('.oxd-loading-spinner', { timeout: 15000 }).should('not.exist');
      cy.url({ timeout: 15000 }).should('include', '/viewPersonalDetails')
        .then(() => logSuccess(`Employee ${employeeID} added successfully`));

      // STEP 5: Count total rows after adding
      logStep('Counting total rows after adding employee');
      cy.contains('a', 'Employee List').click({ force: true });
      getTotalRowsFromPages().then(totalAfterAdd => {
        cy.get('@initialTotalRows').then(initial => {
          expect(totalAfterAdd).to.be.greaterThan(initial);
          logSuccess('Row count increased after adding employee');

          // STEP 6: Verify employee exists via search
          logStep(`Searching for employee ID: ${employeeID}`);
          cy.contains('label', 'Employee Id')
            .parents('.oxd-input-group')
            .find('input')
            .clear()
            .type(employeeID);
          cy.get('button[type="submit"]').click({ force: true });
          cy.get('.oxd-table-body .oxd-table-card')
            .first()
            .should('contain.text', employeeID)
            .and('contain.text', firstName)
            .then(() => logSuccess(`Employee ${employeeID} verified in table`));

          // STEP 7: Delete employee
          logStep('Deleting the employee');
          cy.get('.oxd-table-body .oxd-table-card')
            .first()
            .find('.oxd-table-cell-actions > :nth-child(2) > .oxd-icon')
            .click({ force: true });
          cy.get('button.oxd-button--label-danger').click({ force: true });
          cy.get('.oxd-loading-spinner', { timeout: 15000 }).should('not.exist');

          // STEP 8: Verify employee is gone
          logStep('Verifying employee deletion via search');
          cy.contains('label', 'Employee Id')
            .parents('.oxd-input-group')
            .find('input')
            .clear()
            .type(employeeID);
          cy.get('button[type="submit"]').click({ force: true });
          cy.get('.oxd-table-body .oxd-table-card').should('have.length', 0)
            .then(() => logSuccess(`Employee ${employeeID} successfully deleted`));

          // STEP 9: Count total rows after deletion
          logStep('Counting total rows after deletion');
          getTotalRowsFromPages().then(totalAfterDelete => {
            cy.get('@initialTotalRows').then(initial => {
              expect(totalAfterDelete).to.equal(initial);
              logSuccess(`Total row count after deletion returned to ${initial}`);
            });

            // STEP 10: Test completed
            logStep('Finalizing test');
            cy.then(() => logSuccess('🎉 TEST COMPLETED SUCCESSFULLY'));
          });
        });
      });
    });
  });
});










