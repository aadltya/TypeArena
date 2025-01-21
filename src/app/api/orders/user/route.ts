import { connectDb } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/lib/getDataFromToken";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const reqUserId = getDataFromToken(request);
        if (!reqUserId) {
            return NextResponse.json(
                { message: "User not logged in" },
                { status: 401 }
            );
        }

        await connectDb();

        //check all order of the user

        const ordersDoneByUser = await Order.find({ userId: reqUserId })
            .populate({
                'path': 'items.productId', select: 'name price', options: {
                    strictPopulate: false
                }
            })
            .sort({ orderDate: -1 })
            .lean();

        // add validations

        return NextResponse.json({ message: "order found", order: ordersDoneByUser }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "failed to load user" }, { status: 500 })

    }
}