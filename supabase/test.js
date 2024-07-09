import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.MY_SUPABASE_URL,
  process.env.MY_SUPABASE_ANON_KEY
);

async function invokeFunction() {
  try {
    const { data, error } = await supabase.functions.invoke("esmp", {
      body: {},
    });

    if (error) {
      console.error("Error invoking function:", error);
    } else {
      // console.log("Function response data:", data);
      // 여기서 data를 원하는 대로 처리할 수 있습니다.

      const songs = data.results.map((page) => {
        console.log(page.properties.Link.url);
        return {
          name: page.properties.Song.title[0].text.content,
          url: page.properties.Link.url,
        };
      });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

invokeFunction();
