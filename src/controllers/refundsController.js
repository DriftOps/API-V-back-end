import RefundsDataAccess from "../dataAccess/refundsDataAccess.js"
import { ok, serverError } from "../helpers/httpResponses.js"

export default class RefundsController {
    constructor() {
        this.dataAccess = new RefundsDataAccess()
    }

    async getRefunds() {
        try {
            const refunds = await this.dataAccess.getRefunds()
            return ok(refunds)
        } catch (error) {
            return serverError(error)
        }
    }

    async getRefundsByUserId(userId) {
        try {
            const refunds = await this.dataAccess.getRefundsByUserId(userId)
            return ok(refunds)
        } catch (error) {
            return serverError(error)
        }
    }

    async addRefund(refundData) {
        try {
            const result = await this.dataAccess.addRefund(refundData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async deleteRefund(refundId) {
        try {
            const result = await this.dataAccess.deleteRefund(refundId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    
    async updateStatus(refundId, status) {
    try {
        const result = await this.dataAccess.updateRefund(refundId, { status });
        if (!result.value) {
            return {
                body: { text: 'Reembolso não encontrado' },
                statusCode: 404,
                success: false
            };
        }
        return {
            body: { text: 'Status atualizado com sucesso' },
            statusCode: 200,
            success: true
        };
    } catch (error) {
        return serverError(error);
    }
}

    async updateRefund(refundId, refundData) {
        try {
            const result = await this.dataAccess.updateRefund(refundId, refundData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
}
