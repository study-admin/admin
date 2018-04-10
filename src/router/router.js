import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};
export const pi = {
    path: '/pi',
    name: 'pi',
    meta: {
        title: '试卷'
    },
    component: () => import('@/views/pi.vue')
};
export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/paper',

    component: Main,
    children: [
        { path: 'paper', title: '首页', name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: () => import('@/views/advanced-router/component/order-info.vue') },
        // { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/paperUnload',
        icon: 'lock-combination',
        title: '试卷上传',
        name: 'paperUnload',
        component: Main,
        children: [
            { path: 'paper-upload', title: '试卷上传', name: 'paper-upload',  component: () => import('@/views/paper-upload/paper-upload.vue')
            },

        ]
    },
    {
        path: '/test-questions',
        icon: 'lock-combination',
        title: '试题分类',
        name: 'test-questions',
        component: Main,
        children: [
            { path: 'electric-power', title: '电力类', name: 'electric-power',  component: () => import('@/views/test-questions/electric-power/electric-power.vue')
            },

            { path: 'substation', title: '变电类', name: 'substation',  component: () => import('@/views/test-questions/substation/substation.vue')
            },
            { path: 'general', title: '通用类', name: 'general',  component: () => import('@/views/test-questions/general/general.vue')
            },
        ]
    },
    {
        path: '/paper',
        icon: 'lock-combination',
        title: '试卷管理',
        name: 'paper',
        component: Main,
        children: [
            { path: 'paper-making', title: '试卷制定', name: 'paper-making',  component: () => import('@/views/paper/paper-making/paper-making.vue')
            },
            { path: 'paper-list', title: '试卷列表', name: 'paper-list',  component: () => import('@/views/paper/paper-list/paper-list.vue')
            },
        ]
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    pi,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404,
];
