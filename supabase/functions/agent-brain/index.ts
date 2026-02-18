import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { OpenAI } from "https://esm.sh/openai@4.29.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { taskId } = await req.json();
    if (!taskId) throw new Error("Task ID is required.");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Fetch Task and Agent details
    const { data: task, error: taskError } = await supabaseAdmin
      .from("tasks")
      .select("*, agents(*)")
      .eq("id", taskId)
      .single();

    if (taskError || !task) throw new Error("Task not found.");
    if (!task.agents) throw new Error("Agent associated with task not found.");

    // 2. Set task to 'processing'
    await supabaseAdmin
      .from("tasks")
      .update({ status: "processing", progress: 10 })
      .eq("id", taskId);
    await supabaseAdmin
      .from("agents")
      .update({ status: "working" })
      .eq("id", task.agent_id);

    // 3. Initialize OpenAI client
    const openai = new OpenAI({ apiKey: Deno.env.get("SUPABASE_OPENAI_API_KEY")! });

    // 4. Execute LLM call
    const completion = await openai.chat.completions.create({
      model: task.agents.model,
      messages: [
        { role: "system", content: task.agents.system_prompt || "You are a helpful AI assistant." },
        { role: "user", content: task.instruction },
      ],
    });

    const result = completion.choices[0].message.content;

    // 5. Update task with the result
    await supabaseAdmin
      .from("tasks")
      .update({ status: "completed", progress: 100, result: { content: result } })
      .eq("id", taskId);

    // 6. Set agent back to 'idle'
    await supabaseAdmin
      .from("agents")
      .update({ status: "idle" })
      .eq("id", task.agent_id);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
