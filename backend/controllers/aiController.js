const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateOutline = async (req, res) => {
  try {
    const { topic, style, numChapters, description } = req.body;

    if (!topic) {
      return res.status(400).json({
        message: "Please provide a topic",
      });
    }

    const prompt = `
You are an expert ebook writer.

Create an ebook outline based on the following details:

Topic: ${topic}
Writing Style: ${style || "informative"}
Number of Chapters: ${numChapters || 5}
Description: ${description || "General overview"}

Return ONLY a JSON array.

Each item must contain:
- title
- description

Example:

[
  {
    "title": "Introduction to Artificial Intelligence",
    "description": "Overview of AI concepts and its importance."
  },
  {
    "title": "History of Artificial Intelligence",
    "description": "How AI evolved over time."
  }
]

Do not include markdown, explanation, or extra text.
Return only the JSON array.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.text;

    if (!text) {
      return res.status(500).json({
        message: "AI did not return any content",
      });
    }

    // Extract JSON array 
    const startIndex = text.indexOf("[");
    const endIndex = text.lastIndexOf("]");

    if (startIndex === -1 || endIndex === -1) {
      console.error("AI returned invalid format:", text);
      return res.status(500).json({
        message: "Failed to parse AI response",
      });
    }

    const jsonString = text.substring(startIndex, endIndex + 1);
    const outline = JSON.parse(jsonString);

    res.status(200).json({ outline });

  } catch (error) {
    console.error("Error generating outline:", error);

    res.status(500).json({
      message: "Server error during AI outline generation",
    });
  }
};

const generateChapterContent = async (req, res) => {
  try {
    const { chapterTitle, chapterDescription, style } = req.body;

    if (!chapterTitle) {
      return res.status(400).json({
        message: "Please provide a chapter title",
      });
    }

    const prompt = `
You are an expert ebook writer.

Write a detailed chapter.

Chapter Title: ${chapterTitle}

Description:
${chapterDescription || "Explain the topic clearly."}

Writing Style:
${style || "informative"}

Requirements:
- Around 500 words
- Clear structure
- Engaging explanation
- Suitable for an ebook
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;   //

    if (!text || text.trim() === "") {
      return res.status(500).json({
        message: "AI did not generate any content",
      });
    }

    res.status(200).json({
      content: text.trim(),
    });

  } catch (error) {
    console.error("Error generating chapter:", error);

    res.status(500).json({
      message: "Server error during AI chapter generation",
    });
  }
};


module.exports = {
  generateOutline,
  generateChapterContent,
};