# 搭建node服务器

1. 安装需要的功能

```
    node -v > 8
   npm install -g koa
 npm install -g koa-generator
```
生成项目
```
koa2 koa2-demo2
进入项目，并安装依赖库
 cd koa2-demo2 && npm install
 npm run start 启动项目
```

目录结构
``` 
bin, 存放启动项目的脚本文件
node_modules, 存放所有的项目依赖库。
public，静态文件(css,js,img)
routes，路由文件(MVC中的C,controller)
views，页面文件(pug模板)
package.json，项目依赖配置及开发者信息
app.js，应用核心配置文件
package.json，node项目配置文件
package-lock.json，node项目锁定的配置文件
```

2. 文件分析
app.js 是应用核心配置文件，我们把这个文件能够看明白，整理koa就非常容易了。

app.js文件，我们可以分割为X个部分进行解读：依赖包加载、错误处理、中间件加载、web界面渲染模板、自定义日志、自己定义路由、外部调用接口。
- app.js
```
// 依赖包加载
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')

// 错误处理
onerror(app)

// 中间件加载
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// web界面渲染模板
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 自定义日志
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 自己定义路由
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// 外部调用接口
module.exports = app
```

3. 路由管理

- ./routes/index.js
```
// 解析'/'
router.get('/', async (ctx, next) => {  
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

// 解析 '/string'
router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

// 解析 '/json'
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
```

4. 页面渲染

这里找到index.pug文件， 然后把对象传递给index.pug文件， 进行渲染。
``` 
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})
```

## node热刷新

``` 
npm i nodemon  -g
nodemon bin/www
```

## 添加cors 反向代理

- app.js
``` 
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
// CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
// 下面以koa2-cors为例，  //+
const cors = require('koa2-cors');  //+
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'html'
}))
//实现跨域  // +
app.use(cors({
    origin: function(ctx) {
        if (ctx.url === '/test') {
            return false;
        }
        return '*';
        // return "http://116.196.97.115/";
        // return "http://localhost:3000"
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

```

## 添加登录接口

- routes/index.js
添加接口 `router.post('/login'....` 并验证
``` 
const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/login', async (ctx, next) => {
    let body = ctx.request.body
    let username = body.username;
    let password = body.password;
    console.log(body)
    if( username === "admin" && password.toString() === "123456" ) {
        ctx.body = {
            code: 200,
            message: "登录成功",
            username
        }
    }
    else {
        ctx.body = {
            code: 0,
            message: "登录失败",
        }
    }
})
module.exports = router

```

 登录接口完成， 请求接口（localhost:4000/login）(这里端口被我修改成4000))， 就可以看到 返回的数据了。