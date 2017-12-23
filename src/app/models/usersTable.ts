import {Sequelize} from "sequelize";
import AppTable from "./appTable";

export default class UsersTable extends AppTable {

    constructor(db: Sequelize) {
        super(db);
        this.tab = 'users';
    }

    public findPass(id: number, pass: string, cb: (res: any) => void): void {
        this.users.find({where: {"id": {$eq: id}, "password": {$eq: pass}}}).then((res: any) => {
            cb(res)
        })
    }

    public login(user: Array<string>, cb: (res: any) => void): void {
        this.users.find({where: {"email": {$eq: user[0]}, "password": {$eq: user[1]}}}).then((res: any) => {
            cb(res);
        })
    }

    public findExist(email: string, cb: (res: any) => void): void {
        this.users.find({where: {"email": email}}).then((res: any) => {
            cb(res);
        })
    }

}
