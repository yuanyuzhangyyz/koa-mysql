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



    ctx.body = Nunjucks.render('index.html', {
        users,
        // data,

    });
});


router.get('/register', async ctx => {
    let users = await query(
        'select * from `users`'
    );

    ctx.body = Nunjucks.render('register.html', {
        users
    });
});

// 处理提交数据请求
router.post('/register', KoaBody(), async ctx => {
    let {
        id,
        username
        } = ctx.request.body;
    let rs = await query(
        "insert into `users` (`id`, `username`) values (?, ?)",
        [
            id,
            username
        ]
    );
    console.log("rs******",rs)
    // rs.then(()=>{
    //     ctx.body = "注册成功";

    // },(err)=>{
    //     ctx.body = "注册失败";
    //     console.log("err1111111111",err)
    // })

});



app.use(router.routes());

app.listen(8888, () => {
    console.log(`服务启动成功：http://localhost:8888`);
});


function query(sql, data) {
    return new Promise((resolve, reject) => {
        connection.query(sql, data, function (err, ...data) {
            if (err) {
                console.log("here err",err)
                reject(err);
            } else {
                resolve(...data);
            }
        })
    });
}