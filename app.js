const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const KoaRouter = require('@koa/router');
const Nunjucks = require('nunjucks');
const mysql = require('mysql2');
const KoaBody = require('koa-body');

// const categories = require('./data/categories.json');
// const items = require('./data/items.json');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'kkb_12'
});

const app = new Koa();

Nunjucks.configure('./template', {
    // 开发环境下，设置 noCache 为 true，有利于测试看效果
    noCache: true,
    watch: true
});

// http://localhost:8888/public/css/css.css
app.use(KoaStaticCache('./public', {
    prefix: '/public',
    dynamic: true,
    gzip: true
}));

const router = new KoaRouter();


// 大部分的业务都放在下面处理了

// 商品首页
router.get('/', async ctx => {

    // 对数据进行分页（分批）展示

    // ctx.query 自动解析 当前 url 中 queryString 的部分，也就是url中 ? 后面的内容
    // let page = Number(ctx.query.page) || 1;
    // console.log('page', page);
    // let prepage = 8;
    // let start = (page - 1) * prepage;
    // let end = start + prepage;
    // let pages = Math.ceil(items.length / prepage);

    // let data = items.filter( (item, index) => index >= start && index < end );

    // 数据库操作是异步
    // node 的默认异步处理方式是回调函数
    // node 异步回调 - error first 错误优先
    // let categories = connection.query(
    //     'select * from `categories`'
    // );

    // fs.readFile('./1.txt', function(err, data) {
    //     if (err) {

    //     }
    // });

    let categories = await query(
        'select * from `categories`'
    );

    // console.log('rs', rs);

    let data = await query(
        'select * from `items`'
    );

    ctx.body = Nunjucks.render('index.html', {
        categories,
        data,
        // page,
        // pages
    });
});

// 商品详情
// :id 表示是一个动态路由，:id 是可变的，具体根据请求来决定
// 如果一个请求是以 /item 开始 然后，后面跟着 / 任意内容，就能满足该路由的规则
// :id 是一个占位符 变量，名称可以自己定，但是在中间件里面用的话需要使用这个名称
// (\\d+) 是对可变数据的 约束
router.get('/item/:id(\\d+)', async ctx => {
    // ctx.params => 对象，是 router 中间件根据当前url解析后的数据，里面存储了路由中动态部分当前实际内容
    // console.log('ctx', ctx.params);
    // let id = Number(ctx.params.id);

    // let item = items.find( d => d.id === id );
    // ctx.body = Nunjucks.render('item.html', {
    //     categories,
    //     item
    // });
});

// 渲染表单页面
router.get('/additem', async ctx => {
    let categories = await query(
        'select * from `categories`'
    );

    ctx.body = Nunjucks.render('additem.html', {
        categories
    });
});

// 处理提交数据请求
router.post('/additem', KoaBody(), async ctx => {
    // post 提交的数据解析后存储 ctx.request.body
    // console.log('body', ctx.request.body);
    let {category_id: categoryId, name, price, cover} = ctx.request.body;
    // console.log(categoryId, name, price, cover);
    let rs = await query(
        "insert into `items` (`category_id`, `name`, `price`, `cover`) values (?, ?, ?, ?)",
        [
            categoryId,
            name,
            price,
            cover
        ]
    );

    ctx.body = '添加成功';
});



app.use(router.routes());

app.listen(8888, () => {
    console.log(`服务启动成功：http://localhost:8888`);
});


function query(sql, data) {
    return new Promise( (resolve, reject) => {
        connection.query(sql, data, function(err, ...data) {
            if (err) {
                reject(err);
            } else {
                resolve(...data);
            }
        })
    } );
}