/// <reference types="cypress" />

describe('OrangeHRM Employee Test', () => {

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

  // Robust function to get total rows safely for "(177) Records Found"
  function getTotalRowsFromText() {
    return cy.get('.orangehrm-horizontal-padding > .oxd-text', { timeout: 10000 })
      .should($el => {
        const text = $el.text().trim();
        const match = text.match(/\((\d+)\)/);
        expect(match, `Total rows text should match regex: "${text}"`).to.not.be.null;
        const total = parseInt(match[1], 10);
        expect(total, `Total rows should be greater than what it was at time of addition`).to.be.greaterThan(0);
      })
      .invoke('text')
      .then(text => {
        const match = text.match(/\((\d+)\)/);
        return match ? parseInt(match[1], 10) : 0;
      });
  }

  it('Adds, verifies, deletes employee and checks total rows correctly', () => {
    const firstName = 'Test' + randomString(3);
    const lastName = 'User' + randomString(3);
    const employeeID = 'EMP' + Math.floor(Math.random() * 100000);

    // STEP 1: Login
    logStep('Logging in as Admin');
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { timeout: 120000 });
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 15000 }).should('include', '/dashboard').then(() => logSuccess('Dashboard loaded'));

    // STEP 2: Navigate to Employee List
    logStep('Opening Employee List');
    cy.contains('span', 'PIM').click({ force: true });
    cy.contains('a', 'Employee List').click({ force: true });
    cy.url({ timeout: 15000 }).should('include', '/viewEmployeeList');

    // STEP 3: Count total rows before adding
    logStep('Getting total count of rows before adding employee');
    getTotalRowsFromText().then(initialTotalRows => {
      cy.wrap(initialTotalRows).as('initialTotalRows');
      logSuccess(`Initial total rows: ${initialTotalRows}`);

      // STEP 4: Add Employee
      logStep('Adding a new employee');
      cy.contains('a', 'Add Employee').click({ force: true });
      cy.get('input[placeholder="First Name"]').type(firstName);
      cy.get('input[placeholder="Last Name"]').type(lastName);
      cy.get('input[placeholder="Middle Name"]').type('A'); 
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
      logStep('Getting total rows after adding employee');
      cy.contains('a', 'Employee List').click({ force: true });
      getTotalRowsFromText().then(totalAfterAdd => {
        cy.get('@initialTotalRows').then(initial => {
          expect(totalAfterAdd).to.be.greaterThan(initial);
          logSuccess('Row count increased after adding employee');

          // STEP 6: Verify employee exists using forced search click
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

          // STEP 7: Delete employee safely
          logStep('Deleting the employee');
          cy.get('.oxd-table-body .oxd-table-card')
            .first()
            .find('.oxd-table-cell-actions > :nth-child(2) > .oxd-icon')
            .as('deleteBtn');          
          cy.get('@deleteBtn').click();
          cy.get('button.oxd-button--label-danger').click({ force: true });
          cy.get('.oxd-loading-spinner', { timeout: 15000 }).should('not.exist');

          // STEP 8: Clear search and verify total rows after deletion
          logStep('Clearing search to get updated total rows');
          cy.contains('label', 'Employee Id')
            .parents('.oxd-input-group')
            .find('input')
            .clear();
          cy.get('button[type="submit"]').click({ force: true });

          getTotalRowsFromText().then(totalAfterDelete => {
            cy.get('@initialTotalRows').then(initial => {
              expect(totalAfterDelete).to.equal(initial);
              logSuccess(`Total row count after deletion returned will be less than what it was on addition ${initial}`);
            });

            // STEP 9: Test completed
            logStep('Finalizing test');
            cy.then(() => logSuccess('🎉 TEST COMPLETED SUCCESSFULLY'));
          });
        });
      });
    });
  });
});



















