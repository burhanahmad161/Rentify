import { updateAuctionStatus } from "../../../../lib/actions/Auctions";
export const PUT = async (req, { params }) => {
    try {
      // Extract budgetId from params
      const selectedAuctionId = params;
      console.log("Selected budget ID:", selectedAuctionId.auctionId);
      // Validate input
      if (!selectedAuctionId.auctionId) {
        return new Response(
          JSON.stringify({ error: "Invalid budget ID or amount" }),
          { status: 400 }
        );
      }
  
      // Call the updateBudgetAmount function
      const result = await updateAuctionStatus({
        auctionId: selectedAuctionId.auctionId,
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