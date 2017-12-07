//module.exports='mysql://root:root@localhost:3306/blog'
//module.exports='postgresql://postgres:root@localhost:5432/blog'
module.exports= {
    uri : 'postgresql://postgres:root@localhost:5432/blog' ,
    options : {
        dialect: 'postgres',
        logging : false ,
    }
}