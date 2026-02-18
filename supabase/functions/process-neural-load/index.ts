import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Auto-simulate neural load flux for all 'active' agents
  const { data, error } = await supabaseClient
    .from('agents')
    .select('id, neural_load')
    .eq('status', 'active');

  if (data) {
    for (const agent of data) {
      const newLoad = Math.min(100, Math.max(0, agent.neural_load + (Math.random() * 10 - 5)));
      await supabaseClient.from('agents').update({ neural_load: Math.floor(newLoad) }).eq('id', agent.id);
    }
  }

  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
})
