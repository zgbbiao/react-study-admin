import Loadable from 'react-loadable';
import ContentLoader from '@/components/MyContentLoader';
export const Login = Loadable({
    loader: () => import('@/views/login/index'),
    loading: ContentLoader
});
export const Index = Loadable({
    loader: () => import('@/views/index/index'),
    loading: ContentLoader
});
export const User = Loadable({
    loader: () => import('@/views/users/index'),
    loading: ContentLoader
});
export const User2 = Loadable({
    loader: () => import('@/views/users/index'),
    loading: ContentLoader
});
export const Register = Loadable({
    loader: () => import('@/views/register/index'),
    loading: ContentLoader
});