const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const classifyWaste = async (imageUrl) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    const prompt = `Look at this image and classify the waste shown into exactly ONE of these categories: Plastic, Organic, E-waste, Construction Debris, Mixed Waste, Paper, Metal, Glass. Reply with ONLY the category name, nothing else.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
    ]);

    const category = result.response.text().trim();
    return category;
  } catch (error) {
    console.error("Gemini classification error:", error.message);
    return "Uncategorized";
  }
};

module.exports = { classifyWaste };

