const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const KoaRouter = require('@koa/router');
const Nunjucks = require('nunjucks');
const mysql = require('mysql2');
const KoaBody = require('koa-body');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yyz123asd',
    database: 'kkb'
});

const app = new Koa();

Nunjucks.configure('./template', {
    noCache: true,
    watch: true
});

app.use(KoaStaticCache('./public', {
    prefix: '/public',
    dynamic: true,
    gzip: true
}));

const router = new KoaRouter();



router.get('/', async ctx => {


    let users = await query(
        'select * from `users`'
    );


                    // let data = await query(
                    //     'select * from `items`'
                    // );

    ctx.body = Nunjucks.render('index.html', {
        users,
                         // data,
       
    });
});

// 商品详情
// :id 表示是一个动态路由，:id 是可变的，具体根据请求来决定
// 如果一个请求是以 /item 开始 然后，后面跟着 / 任意内容，就能满足该路由的规则
// :id 是一个占位符 变量，名称可以自己定，但是在中间件里面用的话需要使用这个名称
// (\\d+) 是对可变数据的 约束
                // router.get('/item/:id(\\d+)', async ctx => {

                // });

// 渲染表单页面
router.get('/additem', async ctx => {
    let users = await query(
        'select * from `users`'
    );

    ctx.body = Nunjucks.render('additem.html', {
        users
    });
});

// 处理提交数据请求
                // router.post('/additem', KoaBody(), async ctx => {
                //     // post 提交的数据解析后存储 ctx.request.body
                //     // console.log('body', ctx.request.body);
                //     let {category_id: categoryId, name, price, cover} = ctx.request.body;
                //     // console.log(categoryId, name, price, cover);
                //     let rs = await query(
                //         "insert into `items` (`category_id`, `name`, `price`, `cover`) values (?, ?, ?, ?)",
                //         [
                //             categoryId,
                //             name,
                //             price,
                //             cover
                //         ]
                //     );

                //     ctx.body = '添加成功';
                // });



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