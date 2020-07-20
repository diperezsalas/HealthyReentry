import Vue from 'vue';
import VueRouter from 'vue-router';
// import About from '@/views/About.vue';
// import Profile from '@/views/Profile.vue';
// import Test from '@/views/Test.vue';
import Intro from '@/views/Intro.vue';
import Disclosure from '@/views/Disclosure.vue';
import Menu from '@/views/Menu.vue';
import Encounter from '@/views/Encounter.vue';
import Status from '@/views/Status.vue';
import DisplayQR from '@/views/DisplayQR.vue';
import Admin from '@/views/Admin.vue';
import OfficeAdmin from '@/views/Offices.vue';
import UsersAdmin from '@/views/Users.vue';
import NotFound from '@/views/404.vue';
import { getInstance, useAuth0 } from "../auth/index";

import store from '@/store/index.js';

import { authGuard } from "@/auth/authGuard";
import { loginWithRedirect } from "@/auth/index";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes: [

        {
            path: '/',
            name: 'home',
            component: Intro,
            beforeEnter: authGuard,
            meta: {
                title: route => "Healthy Reentry: Welcome",
                access: 'full'
            },
            props: true
        },
        {
            path: '/disclosure',
            name: 'disclosure',
            component: Disclosure,
            beforeEnter: authGuard,
            meta: {
                title: route => "Healthy Reentry: Disclosure and Consent",
                access: 'user'
            },
            props: true
        },
        {
            path: '/menu',
            name: 'menu',
            component: Menu,
            beforeEnter: authGuard,
            meta: {
                title: route => "Healthy Reentry: Menu",
                access: 'user'
            },
            props: true
        },
        {
            path: '/encounter/:scannedUser?',
            name: 'encounter',
            component: Encounter,
            meta: {
                title: route => "Healthy Reentry: Record Your Encounter",
                access: 'user'
            },
            beforeEnter: authGuard,
            props: true
        },
        {
            path: '/:id/status',
            name: 'status',
            component: Status,
            meta: {
                title: route => "Healthy Reentry: Record Your Status",
                access: 'user'
            },
            beforeEnter: authGuard,
            props: true
        },
        {
            path: '/:id/displayqr',
            name: 'displayqr',
            component: DisplayQR,
            meta: {
                title: route => "Healthy Reentry: View Your QR Code",
                access: 'user'
            },
            beforeEnter: authGuard,
            props: true
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin,
            meta: {
                title: route => "Healthy Reentry: Admin View",
                access: 'officeAdmin'
            },
            beforeEnter: authGuard,
            props: true
        },
        {
            path: '/adminusers',
            name: 'adminusers',
            component: UsersAdmin,
            meta: {
                title: route => "Healthy Reentry: Users Admin View",
                access: 'admin'
            },
            beforeEnter: authGuard,
            props: true
        },
        {
            path: '/officeadmin',
            name: 'officeadmin',
            component: OfficeAdmin,
            meta: {
                title: route => "Healthy Reentry: Office Admin View",
                access: 'admin'
            },
            beforeEnter: authGuard,
            props: true
        },
        {
            path: '*',
            name: 'NotFound',
            component: NotFound
        }
    ]
});

router.beforeEach((to, from, next) => {

    const authService = getInstance();
    if (authService.isAuthenticated) {
        if (!allowAccess(authService.userDB.permissions, to.meta.access)) {
            authService.loginWithRedirect();
        } else {
            next();
        }
    } else {
        setTimeout(() => {
            if (authService.isAuthenticated) {
                authService.$api.post('/api/user', authService.user).then(returnedUser => {
                    const user = returnedUser.data;

                    if (!allowAccess(user.permissions, to.meta.access)) {
                        authService.loginWithRedirect();
                    } else {
                        next();
                    }
                });

            } else if (this.user.dateOfConsent) {
                authService.loginWithRedirect();

            }
            next();
        }, 1000);
    }
});

let allowAccess = (user, access) => {
    let allow = true;
    switch (access) {
        case 'admin':
            if (user.admin === false) {
                allow = false;
            }
            break;
        case 'officeAdmin':
            if (user.admin === false && user.office_admin === false) {
                allow = false;
            }
            break;
    }
    return allow;
};

export default router;