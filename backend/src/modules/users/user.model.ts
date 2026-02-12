import type {Knex} from 'knex';
import type { ErrorSchema } from '../../utils/app.error';

interface ModelOptions{
    db:Knex,
    Error:ErrorSchema
}

const createUserModel = (opts:ModelOptions)=>{
    const create = async(phone:string)=>await opts.db("users").insert({phone}).returning("*");
    const update = async(payload:object,id:string)=>await opts.db("users").update(payload).where({id}).returning("*");
    const destroy= async(id:string)=>await opts.db("users").where({id}).del().returning("*");
    const read = async(id:string)=>await opts.db("users").where({id}).first();
    const readUserByPhone = async(phone:string)=>{
        return await opts.db("users").where({phone}).first();
    };

    return {
        create,
        update,
        read,
        destroy,
        readUserByPhone
    }
}

export type UserModel = ReturnType<typeof createUserModel>;
export default createUserModel;