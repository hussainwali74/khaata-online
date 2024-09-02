import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        return NextResponse.json({
            success: true,
            message: "hi"
        })
    } catch (e) {
        return NextResponse.json({
            success: true,
            message: "hi"
        })

    }
}
export async function GET(req: Request) {
    try {
        const url = process.env.BE_URL + "/api/shop/customers/"


        console.log('-----------------------------------------------------')
        console.log(`url get customers :>>`, url)
        console.log('-----------------------------------------------------')

        const res = await axios.get(url)

        console.log('-----------------------------------------------------')
        console.log(`res :>>`, res.data)
        console.log('-----------------------------------------------------')
        if (res.data) {

            return NextResponse.json({
                success: true,
                data: res.data
            })
        } else {

            return NextResponse.json({
                success: true,
                data: []
            })
        }
    } catch (e) {

        // console.log('-----------------------------------------------------')
        // console.log(`error :>>`, e)
        // console.log('-----------------------------------------------------')

        return NextResponse.json({
            success: true,
            message: e
        })

    }
}

export async function DELETE(req: NextRequest) {
    try {

        const id = req.nextUrl.searchParams.get("id");
        const url = process.env.BE_URL + "/api/shop/customers/" + id + "/"

        console.log('-----------------------------------------------------')
        console.log(`url :>>`, url)
        console.log('-----------------------------------------------------')

        const res = await axios.delete(url)

        console.log('-----------------------------------------------------')
        console.log(`res :>>`, res.data)
        console.log('-----------------------------------------------------')

        return NextResponse.json({
            success: true,
            data: [],
            message: `customer ${id} deleted successfully`
        })
    } catch (e) {

        // console.log('-----------------------------------------------------')
        // console.log(`error :>>`, e)
        // console.log('-----------------------------------------------------')

        return NextResponse.json({
            success: true,
            message: e
        })

    }
}  