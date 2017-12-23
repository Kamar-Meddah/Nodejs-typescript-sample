// module.exports='mysql://root:root@localhost:3306/blog'
// module.exports='postgresql://postgres:root@localhost:5432/blog'
export default abstract class DBConfig {

    public static uri: string = 'postgresql://postgres:root@localhost:5432/blog';
    public static options: object = {
        dialect: 'postgres',
        logging : false ,
        pool: {
            max: 100,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
    };

}