
export const validate = (schema) => {

  return (req, res, next) => {
    
    if (!req.body || Object.keys(req.body).length === 0) {
      // For EJS views, we'll store the error in res.locals and render the appropriate page
      res.locals.validationError = "Request body is required";
      res.locals.validationErrors = { general: "Request body is required" };
      
      // Determine which page to render based on the route
      const renderPage = getRenderPageForRoute(req.path, req.method);
      return renderPage(req, res, next);
    }

    const { error } = schema.validate(req.body, { abortEarly: false });   // { abortEarly: false }); : stp in first error

    if (error) {
      const messages = {};
      const fieldErrors = {};
      
      for (const err of error.details) {
        const field = err.path[0];
        messages[field] = err.message;
        fieldErrors[field] = err.message;
      }

      // Store validation errors in res.locals for EJS
      res.locals.validationError = "Please correct the errors below";
      res.locals.validationErrors = fieldErrors;
      res.locals.oldInput = req.body; // Store old input to repopulate form
      
      // Determine which page to render based on the route
      const renderPage = getRenderPageForRoute(req.path, req.method);
      return renderPage(req, res, next);
    }

    next();

  };

};

// Helper function to determine which page to render based on the route
const getRenderPageForRoute = (path, method) => {
  return (req, res, next) => {
    // Get the base route without ID parameter
    const baseRoute = path.replace(/\/\d+.*$/, '');
    
    // Map routes to their render functions
    const routeRenderMap = {
      '/categories': () => res.redirect('/categories'),
      '/categories/new': () => res.render('pages/categories/form', { 
        title: 'Add Category', 
        mode: 'create', 
        item: null, 
        user: req.user 
      }),
      '/transactions': () => res.redirect('/transactions'),
      '/transactions/new': () => res.render('pages/transactions/form', { 
        title: 'Add Transaction', 
        mode: 'create', 
        item: null, 
        user: req.user 
      }),
      '/budgets': () => res.redirect('/budgets'),
      '/budgets/new': () => res.render('pages/budgets/form', { 
        title: 'Add Budget', 
        mode: 'create', 
        item: null, 
        user: req.user 
      }),
      '/goals': () => res.redirect('/goals'),
      '/goals/new': () => res.render('pages/goals/form', { 
        title: 'Add Goal', 
        mode: 'create', 
        item: null, 
        user: req.user 
      }),
      '/profile': () => res.render('pages/profile', { 
        title: 'Profile', 
        user: req.user, 
        emailVerified: Boolean(req.session && req.session.emailVerified) 
      }),
      '/register': () => res.render('pages/auth/register', { 
        title: 'Register', 
        user: req.user 
      }),
      '/login': () => res.render('pages/auth/login', { 
        title: 'Login', 
        user: req.user 
      }),
      '/forgot-password': () => res.render('pages/auth/forgot', { 
        title: 'Forgot Password', 
        user: req.user 
      }),
      '/reset-password': () => res.render('pages/auth/reset', { 
        title: 'Reset Password', 
        user: req.user 
      })
    };

    // Check for edit routes
    if (path.includes('/edit')) {
      const editRouteMap = {
        '/categories': () => res.redirect(`/categories/${req.params.id}/edit`),
        '/transactions': () => res.redirect(`/transactions/${req.params.id}/edit`),
        '/budgets': () => res.redirect(`/budgets/${req.params.id}/edit`),
        '/goals': () => res.redirect(`/goals/${req.params.id}/edit`)
      };
      
      const editRoute = editRouteMap[baseRoute];
      if (editRoute) {
        return editRoute();
      }
    }

    // Check for update routes (POST to existing items)
    if (method === 'POST' && req.params.id) {
      const updateRouteMap = {
        '/categories': () => res.redirect(`/categories/${req.params.id}/edit`),
        '/transactions': () => res.redirect(`/transactions/${req.params.id}/edit`),
        '/budgets': () => res.redirect(`/budgets/${req.params.id}/edit`),
        '/goals': () => res.redirect(`/goals/${req.params.id}/edit`)
      };
      
      const updateRoute = updateRouteMap[baseRoute];
      if (updateRoute) {
        return updateRoute();
      }
    }

    // Default route handling
    const renderFunction = routeRenderMap[baseRoute];
    if (renderFunction) {
      return renderFunction();
    }

    // Fallback - redirect to the base route
    return res.redirect(baseRoute || '/');
  };
};
