const routes = [

  {
    path: '/',
    redirect: '/login', // Redirect to login page default
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
       {
         path: 'dashboard',
         name: 'Dashboard',
         component: () => import('src/pages/dashboard/DashBoard.vue'),
        //  meta: { requiresAuth: true },
       },
      {
        path: 'login',
        name: 'Login',
        component: () => import('src/pages/auth/LoginUser.vue')
      },
    ],
  },
  {
  path: '/forms',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    {
      path: 'form',
      name: 'FirstForm',
      component: () => import('src/pages/form/FirstForm.vue'),
      // meta: { requiresAuth: true },
    },
  ],
},
{
  path: '/results',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    {
      path: 'result',
      name: 'ResultsPage',
      component: () => import('src/pages/response/ResultsPage.vue'),
      // meta: { requiresAuth: true },
    },
  ],
},
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
