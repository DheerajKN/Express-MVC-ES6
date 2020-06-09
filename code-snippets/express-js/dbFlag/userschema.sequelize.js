import Sequelize from 'sequelize';
import { sequelize } from './index'

const User = sequelize.define('User', {
  email: {
    type: Sequelize.STRING,
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
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }},{
    timestamps: false
  });
export default User;