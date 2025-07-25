describe('Connexion', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/#/login');
    cy.get('body').then(($body) => {
      if ($body.find('.q-drawer__backdrop').length) {
        cy.get('.q-drawer__backdrop').click({ force: true });
      }
    });
    cy.get('form.q-form', { timeout: 10000 }).should('be.visible');
  });

  afterEach(() => {
    cy.request({ method: 'POST', url: 'http://localhost:8000/api/auth/logout', failOnStatusCode: false });
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.get('body').then(($body) => {
      if ($body.find('.q-drawer__backdrop').length) {
        cy.get('.q-drawer__backdrop').click({ force: true });
      }
    });
  });

  it('devrait se connecter avec succès avec des informations valides', () => {
    cy.get('input[aria-label="Email"]').type('syble02@nader.biz');
    cy.get('input[aria-label="Password"]').type('password');
    cy.get('input[type="checkbox"]').check({ force: true }); // Forcer le coche
    cy.get('form.q-form').submit();
    cy.contains('.q-notification', 'Login successful! Welcome back.', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/dashboard');
  });

  it('devrait afficher une erreur pour des informations d\'identification incorrectes', () => {
    cy.intercept('POST', 'http://localhost:8000/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginRequest');
    cy.get('input[aria-label="Email"]').type('wrong@example.com');
    cy.get('input[aria-label="Password"]').type('wrongpassword');
    cy.get('form.q-form').submit();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.contains('.q-notification', 'Connection failed. Please check your credentials and try again.', { timeout: 10000 }).should('be.visible');
  });

  it('devrait afficher une erreur si le compte est désactivé', () => {
    cy.intercept('POST', 'http://localhost:8000/api/auth/login', {
      statusCode: 403,
      body: { message: 'Account deactivated' },
    }).as('loginRequest');
    cy.get('input[aria-label="Email"]').type('deactivated@example.com');
    cy.get('input[aria-label="Password"]').type('password123');
    cy.get('form.q-form').submit();
    cy.wait('@loginRequest');
    cy.contains('.q-notification', 'Your account is deactivated. Please contact your favorite Admin.', { timeout: 10000 }).should('be.visible');
  });

  it('devrait se souvenir de l\'email si "Remember Me" est coché', () => {
    cy.get('input[aria-label="Email"]').type('syble02@nader.biz');
    cy.get('input[aria-label="Password"]').type('password');
    // cy.get('.q-checkbox').click(); // Clic sur le composant visible Quasar (ajustez le sélecteur si nécessaire)
    // Alternative : cy.get('input[type="checkbox"]').check({ force: true }); // Si vous préférez forcer
    cy.get('form.q-form').submit();
    cy.url().should('include', '/dashboard');
    cy.visit('http://localhost:9000/#/logout'); // Vérifiez que c’est la bonne URL

    cy.visit('http://localhost:9000/#/login');
    cy.get('form.q-form', { timeout: 10000 }).should('be.visible');

    // Vérifier que l’email est bien pré-rempli
    cy.get('input[aria-label="Email"]').should('have.value', 'syble02@nader.biz', { timeout: 10000 });

    // Vérifier que la checkbox est cochée
    cy.get('.q-checkbox').should('have.attr', 'aria-checked', 'true');
  });
});