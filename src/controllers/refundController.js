import RefundsDataAccess from '../dataAccess/refundsDataAccess.js'
import httpResponses from '../helpers/httpResponses.js'

class RefundsController {
  constructor() {
    this.refundsDataAccess = new RefundsDataAccess()
  }

  async getRefunds() {
    try {
      const refunds = await this.refundsDataAccess.getAllRefunds()
      return httpResponses.ok(refunds)
    } catch (err) {
      return httpResponses.serverError(err.message)
    }
  }

  async addRefund(refund) {
    try {
      const newRefund = await this.refundsDataAccess.createRefund(refund)
      return httpResponses.created(newRefund)
    } catch (err) {
      return httpResponses.serverError(err.message)
    }
  }

  async deleteRefund(id) {
    try {
      await this.refundsDataAccess.deleteRefund(id)
      return httpResponses.noContent()
    } catch (err) {
      return httpResponses.serverError(err.message)
    }
  }

  async updateRefund(id, data) {
    try {
      const updated = await this.refundsDataAccess.updateRefund(id, data)
      return httpResponses.ok(updated)
    } catch (err) {
      return httpResponses.serverError(err.message)
    }
  }
}

export default RefundsController
