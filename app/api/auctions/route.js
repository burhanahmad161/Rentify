import { v2 as cloudinary } from "cloudinary";
import { createAuction, getAuctions } from "../../../lib/actions/Auctions";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
    try {
        const formData = await req.formData();
        const title = formData.get("title");
        const description = formData.get("description");
        const currentBid = formData.get("currentBid");
        const timeRemaining = formData.get("timeRemaining");
        const image = formData.get("image"); // File

        if (!image) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        // Convert image file to Base64
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

        // Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
            folder: "auctions",
        });

        // Save auction to MongoDB
        const newAuction = await createAuction({
            title,
            description,
            currentBid,
            timeRemaining,
            image: uploadResult.secure_url, // Save Cloudinary URL
        });

        return NextResponse.json(newAuction, { status: 201 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
};
export const GET = async (req) => { 
    try {
        const auctions = await getAuctions();
        return NextResponse.json(auctions);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
};