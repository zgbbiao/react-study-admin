# 一步一步构件react后台系统 8 之 按需加载

```
npm i react-loadable -D
npm i react-content-loader -D
```

- 添加文件 router/toComponent.js

从router/index.js 中提取引入的文件， 并修改成以下的样子
```
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
```

- 添加组件 components/MyContentLoader.js

```
import React from 'react';
import ContentLoader from 'react-content-loader';
export default () => {
    return (
        <div style={{ paddingLeft:20,paddingTop:20 }}>
            <ContentLoader
                height={160}
                width={400}
                speed={2}
                primaryColor="#f3f3f3"
                secondaryColor="#ecebeb"
            >
                <rect x="70" y="15" rx="4" ry="4" width="117" height="6.4" />
                <rect x="70" y="35" rx="3" ry="3" width="85" height="6.4" />
                <rect x="0" y="80" rx="3" ry="3" width="350" height="6.4" />
                <rect x="0" y="100" rx="3" ry="3" width="380" height="6.4" />
                <rect x="0" y="120" rx="3" ry="3" width="201" height="6.4" />
                <circle cx="30" cy="30" r="30" />
            </ContentLoader>
        </div>
    );
}
```

- router/index.js

 修改引入方式。
```
import { Login, Index, User, User2, Register } from '@/router/toComponent'

```

这样 ，按需加载就完成了。 只有当跳转到该路由， 才会添加改内容。