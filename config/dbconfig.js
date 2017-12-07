//module.exports='mysql://root:root@localhost:3306/blog'
//module.exports='postgresql://postgres:root@localhost:5432/blog'
module.exports= {
    uri : 'postgresql://postgres:root@localhost:5432/blog' ,
    options : {
        dialect: 'postgres',
        logging : false ,
        pool: {
            max: 100,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
    }
}