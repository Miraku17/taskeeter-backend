const getQuote = async (req, res) => {
    try {
      const response = await fetch(
        "https://api.api-ninjas.com/v1/quotes?category=inspirational",
        {
          headers: {
            "X-Api-Key": process.env.API_NINJA_KEY
        },
        }
      );
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Error fetching quote" });
    }
  };
  
  module.exports = {
    getQuote,
  };