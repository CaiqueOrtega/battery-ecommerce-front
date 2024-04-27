import ConnectionAPI from "../ConnectionAPI";
import { useState } from "react";

const PromotionService = () => {

    const getPromotions = async () => {
        try {
            const response = await ConnectionAPI.get('promotion')
            return response.data
        } catch (error) {
            console.error(error)
        }
    }

    const updatePromotion = async (promotionId, promotion) => {
        try {
            const response = await ConnectionAPI.patch(`promotion/${promotionId}`, {
                expirationDate: promotion.expirationDate,
                percentage: promotion.percentage,
                code: promotion.code
            })
            return { success: true };
        } catch (error) {
            return error;
        }
    }

    const deletePromotion = async (promotionCode) => {
        try {
            await ConnectionAPI.delete(`promotion/${promotionCode}`)
            return { success: true };
        } catch (error) {
            return error;
        }
    }

    const createPromotion = async (promotion) => {
        try {
            await ConnectionAPI.post('promotion', {
                expirationDate: promotion.expirationDate,
                percentage: promotion.percentage,
                code: promotion.code
            })
            return { success: true };
        } catch (error) {
            return error;
        }
    }

    const reactivePromotion = async (promotionId, promotion) => {
        console.log(promotionValues);
        try {
            const response = await ConnectionAPI.put(`promotion/reactive/${promotionId}`, {
                expirationDate: promotion.expirationDate,
                percentage: promotion.percentage,
                code: promotion.code
            })
            return { success: true };
        } catch (error) {
            return error;
        }
    }

    return { getPromotions, updatePromotion, deletePromotion, createPromotion, reactivePromotion }
}

export default PromotionService