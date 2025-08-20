import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "starlight-job-app",
apiKey: process.env.INNGEST_API_KEY,

});