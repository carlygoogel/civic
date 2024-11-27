/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import { EmailFormData } from "@/utils/types";
import { createClient } from "@/supabase/server";

const filePath = "scripts/emails.json";

try {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const rawData = JSON.parse(fileContents);

  const data: EmailFormData[] = rawData.map((email: any) => {
    const profile = email.profile || {};
    const topicArray = email.topics || [];
    const firstTopic = topicArray[0] || {};
    const { topicName } = firstTopic;
    return {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      streetAddress: profile.streetAddress || "",
      city: profile.city || "",
      state: profile.state || "",
      zipCode: profile.zipCode || "",
      email: profile.email || "",
      phoneNumber: profile.phoneNumber || "",
      messageSubject: email.subject || "",
      messageBody: email.body || "",
      topic: topicName || "",
    };
  });

  console.log(data[0]);
  // write to file (emailParsed.json)
  fs.writeFileSync("scripts/emailParsed.json", JSON.stringify(data, null, 2));
} catch (error) {
  console.error("Error reading or parsing emails.json:", error);
}

const sendEmailsToDB = async () => {
  const supabase = await createClient();
};

export { sendEmailsToDB };
