// GeneralViews

import App from "@/App";
import Swap from "@/components/Swap";
import About from "@/components/About";
import NotFound from "@/components/NotFound";
import Admin from "@/components/Admin";
import Pool from "@/components/Pool";

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/swap',
    component: App,
    children: [
      {
        path: 'swap',
        name: 'swap',
        components: {default: Swap}
      },
      {
        path: 'pool',
        name: 'pool',
        components: {default: Pool}
      },
      {
        path: 'about',
        name: 'about',
        components: {default: About}
      },
      {
        path: 'admin',
        name: 'admin',
        components: {default: Admin}
      },
    ]
  },
  {path: "*", component: NotFound},
];

export default routes;
