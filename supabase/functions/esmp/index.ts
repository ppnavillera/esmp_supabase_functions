import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/dotenv/load.ts";
import { corsHeaders } from "./cors.ts";
import axios from "https://deno.land/x/axiod/mod.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN");
    const NOTION_DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID");
    const { query } = await req.json();

    const notionResponse = await axios.post(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      query,
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
      },
    );

    const data = notionResponse.data;

    // const songs = data.results.map(
    //   (
    //     page: {
    //       properties: {
    //         Link: { url: any };
    //         Song: { title: { text: { content: any } }[] };
    //       };
    //     },
    //   ) => {
    //     console.log(page.properties.Link.url);
    //     return {
    //       name: page.properties.Song.title[0].text.content,
    //       url: page.properties.Link.url,
    //     };
    //   },
    // );
    // console.log(data);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
