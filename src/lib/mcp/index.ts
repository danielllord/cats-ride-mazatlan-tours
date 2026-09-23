import { defineMcp } from "@lovable.dev/mcp-js";

import getTourInfo from "./tools/get-tour-info";
import submitTourInquiry from "./tools/submit-tour-inquiry";

export default defineMcp({
  name: "cats-ride-mazatlan",
  title: "Cat's Ride Mazatlan",
  version: "1.0.0",
  instructions:
    "Tools for Cat's Ride Mazatlan, private personalized tours in Mazatlán, Mexico with local guide Martin. Use get_tour_info to answer questions about the tours, and submit_tour_inquiry to send Martin a booking inquiry on behalf of the customer. No payment or deposit is ever taken.",
  tools: [getTourInfo, submitTourInquiry],
});
