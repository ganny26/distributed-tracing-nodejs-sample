import { DataTypes } from 'sequelize'
const OrdersTable = (sequelize) => {
  const OrdersTable = sequelize.define(
    'ORDERS',
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      ACCOUNT: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      PRODUCT_NAME: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      PRICE: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      ORDER_STATUS: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'ORDERS',
      timestamps: true,
      freezeTableName: true,
    }
  )
  return OrdersTable
}

export default OrdersTable
