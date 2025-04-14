import { updateAuctionStatus, registerForAuction,deleteMyItem,addRatingToItem  } from "../../../../lib/actions/Rental";

export const PUT = async (req, { params }) => {
    try {
      const selectedAuctionId = params;
      console.log(selectedAuctionId);
      console.log("Selected Item Id:", selectedAuctionId.auctionId);
      // Validate input
      if (!selectedAuctionId.auctionId) {
        return new Response(
          JSON.stringify({ error: "Invalid budget ID or amount" }),
          { status: 400 }
        );
      }
  
      // Call the updateBudgetAmount function
      const result = await updateAuctionStatus({
        rentalId: selectedAuctionId.auctionId,
      });
  
  
      // Return success response
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
      });
    } catch (error) {
      console.error("API error:", error);
  
      // Return error response
      return new Response(
        JSON.stringify({ error: "Server error", details: error.message }),
        { status: 500 }
      );
    }
  };

  export const POST = async (req, { params, body }) => {
    try {
      const body = await req.json();
      // Extract budgetId from params
      //const selectedAuctionId = params;\
      console.log("Hello");
      console.log("Bitch",body.auctionId, body.username);
      if (!body.auctionId || !body.username) {
        return new Response(
          JSON.stringify({ error: "Invalid budget ID or amount" }),
          { status: 400 }
        );
      }
      console.log(body.auctionId, body.username);
      // Call the updateBudgetAmount function
      const result = await registerForAuction({
        auctionId: body.auctionId,
        name: body.username,
      });
  
  
      // Return success response
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
      });
    } catch (error) {
      console.error("API error:", error);
  
      // Return error response
      return new Response(
        JSON.stringify({ error: "Server error", details: error.message }),
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request, { params }) {
    try {
      const auctionId = params.auctionId;
      console.log("Rental ID received At API AUCTION:", auctionId);
      
      const result = await deleteMyItem({ _id: auctionId });
      
      return Response.json(result, { status: 200 });
    } catch (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }

  export const PATCH = async (req, { params }) => {
    try {
      const auctionId = params.auctionId;
      const body = await req.json();
      const { userId, stars } = body;
      console.log(auctionId);

      if (!userId || stars===undefined || !auctionId) {
        return new Response(
          JSON.stringify({ error: "Missing rating, userId, or rentalId" }),
          { status: 400 }
        );
      }
  
      const result = await addRatingToItem({
        rentalId: auctionId,
        userId,
        rating: stars,
      });
  
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
      });
    } catch (error) {
      console.error("Rating error:", error);
      return new Response(
        JSON.stringify({ error: "Server error", details: error.message }),
        { status: 500 }
      );
    }
  };