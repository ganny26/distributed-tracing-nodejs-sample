import { DataTypes } from 'sequelize'
const UserTable = (sequelize) => {
  const UsersTable = sequelize.define(
    'USERS',
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      USER_NAME: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      ACCOUNT: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      AMOUNT: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      STATUS: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'USERS',
      timestamps: true,
      freezeTableName: true,
    }
  )
  return UsersTable
}

export default UserTable
