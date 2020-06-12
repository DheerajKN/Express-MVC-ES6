import {Model, BuildOptions, DataTypes} from 'sequelize';
import { sequelize } from './index'

export interface IUser extends Model {
  email: string,
  password: string
}

type IUserModel = typeof Model & {
  new (values?: object, options?: BuildOptions): IUser;
}

const User: any = <IUserModel>sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: {
        msg: 'Email Address must be valid'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }},{
    timestamps: false
  });
export default User;