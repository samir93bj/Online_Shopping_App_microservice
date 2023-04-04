const { ShoppingRepository } = require('../database')
const { FormateData } = require('../utils')
const { APIError } = require('../utils/app-errors')

// All Business logic will be here
class ShoppingService {
  constructor () {
    this.repository = new ShoppingRepository()
  }

  async getCart ({ _id }) {
    try {
      const cartItems = await this.repository.Cart(_id)

      return FormateData(cartItems)
    } catch (err) {
      throw new APIError('Data not Found', err)
    }
  }

  async PlaceOrder (userInput) {
    const { _id, txnNumber } = userInput
    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber)
      return FormateData(orderResult)
    } catch (err) {
      throw new APIError('Data Not found', err)
    }
  }

  async GetOrders (customerId) {
    try {
      const orders = await this.repository.Orders(customerId)
      return FormateData(orders)
    } catch (err) {
      throw new APIError('Data Not found', err)
    }
  }
}

module.exports = ShoppingService
