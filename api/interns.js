// Vercel Serverless Function — fetches interns from Notion API
// Requires NOTION_TOKEN environment variable (Notion integration token)

const DATABASE_ID = "9c5a75e986e94d46b8b67ae590940c7f";

export default async function handler(req, res) {
  // CORS headers for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "NOTION_TOKEN non configuré" });
  }

  try {
    // Query all pages from the database
    let allResults = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const body = {
        page_size: 100,
        sorts: [{ property: "Nom", direction: "ascending" }],
      };
      if (startCursor) body.start_cursor = startCursor;

      const response = await fetch(
        `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        return res.status(response.status).json({ error: err });
      }

      const data = await response.json();
      allResults = allResults.concat(data.results);
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    // Transform Notion pages into clean JSON
    const interns = allResults.map((page) => {
      const p = page.properties;
      return {
        id: page.id,
        nom: p["Nom"]?.title?.[0]?.plain_text || "",
        courriel: p["Courriel"]?.email || "",
        heures: p["Total = H.Sem"]?.number,
        lundi: p["Lun"]?.checkbox || false,
        mardi: p["Mar"]?.checkbox || false,
        mercredi: p["Mer"]?.checkbox || false,
        jeudi: p["Jeu"]?.checkbox || false,
        vendredi: p["Ven"]?.checkbox || false,
        statut: p["Statut"]?.select?.name || "En attente",
        notes: p["Notes"]?.rich_text?.[0]?.plain_text || null,
      };
    });

    return res.status(200).json(interns);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
