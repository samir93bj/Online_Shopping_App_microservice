const { ShoppingRepository } = require('../database')
const { FormateData } = require('../utils')
const { APIError } = require('../utils/error/app-errors')

// All Business logic will be here
class ShoppingService {
  constructor () {
    this.repository = new ShoppingRepository()
  }

  async GetCart ({ _id }) {
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

  async ManageCart (customerId, item, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(customerId, item, qty, isRemove)

      return FormateData(cartResult)
    } catch (err) {
      throw new APIError('Data Not found', err)
    }
  }

  async SubscribeEvents (payload) {
    const { event, data } = payload

    const { userId, product, order, qty } = data

    switch (event) {
      case 'ADD_TO_CART':
        this.ManageCart(userId, product, qty, false)
        break
      case 'REMOVE_FROM_CART':
        this.ManageOrder(userId, order, qty, true)
        break
      default:
        break
    }
  }

  async GetOrderPayload (userId, order, event) {
    if (order) {
      const payload = {
        event,
        data: { userId, order }
      }

      return payload
    } else {
      return FormateData({ error: 'No Order Available' })
    }
  }
}

module.exports = ShoppingService
