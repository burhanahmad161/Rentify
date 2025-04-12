import { log } from "console";
import { rentItem } from "../../../../../lib/actions/Rental";

export const POST = async (req, { params }) => {
    try {
      const body = await req.json();
  
      // Check if this is a rent request
      if (body.type === "rent") {
        console.log("Renting item:", body.rentalId, body.userId);
  
        if (!body.rentalId || !body.userId) {
          return new Response(
            JSON.stringify({ error: "Invalid rental ID or user ID" }),
            { status: 400 }
          );
        }
  
        const result = await rentItem({
          rentalId: body.rentalId,
          userId: body.userId,
        });
  
        return new Response(JSON.stringify({ success: true, result }), {
          status: 200,
        });
      }
  
      // Otherwise assume it's registration
      console.log("Registering for auction:", body.auctionId, body.username);
  
      if (!body.auctionId || !body.username) {
        return new Response(
          JSON.stringify({ error: "Invalid auction ID or username" }),
          { status: 400 }
        );
      }
  
      const result = await registerForAuction({
        auctionId: body.auctionId,
        name: body.username,
      });
  
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
      });
    } catch (error) {
      console.error("API error:", error);
      return new Response(
        JSON.stringify({ error: "Server error", details: error.message }),
        { status: 500 }
      );
    }
  };