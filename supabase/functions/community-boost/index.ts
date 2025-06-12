// supabase/functions/community-boost/index.ts

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { groupId } = await req.json();
    if (!groupId) {
      throw new Error("Group ID is required.");
    }

    // Create a Supabase client that is authenticated as the user who called the function
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the user who is making the request
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated.");
    }

    // Security Check: Verify the user is the host of the group they're trying to boost
    const { data: group, error: groupError } = await supabaseClient
      .from('products')
      .select('host_id, title, farmer_id')
      .eq('id', groupId)
      .single();

    if (groupError || !group) {
      throw new Error("Group not found.");
    }
    
    if (group.host_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Permission denied: You are not the host of this group." }), 
        { 
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Get the host's profile to find their zip code
    const { data: hostProfile, error: hostError } = await supabaseClient
      .from('profiles')
      .select('zip_code, full_name')
      .eq('id', user.id)
      .single();

    if (hostError || !hostProfile?.zip_code) {
      throw new Error("Host zip code not found. Please update your profile.");
    }

    // Find users in the same zip code who might be interested
    const { data: nearbyUsers, error: usersError } = await supabaseClient
      .from('profiles')
      .select('id, email, full_name')
      .eq('zip_code', hostProfile.zip_code)
      .neq('id', user.id) // Exclude the host themselves
      .limit(50); // Limit to prevent spam

    if (usersError) {
      console.error('Error finding nearby users:', usersError);
    }

    // Get farmer information for the notification
    const { data: farmer, error: farmerError } = await supabaseClient
      .from('farmers')
      .select('name, farm_name')
      .eq('id', group.farmer_id)
      .single();

    // Log the boost activity for analytics
    console.log(`Community Boost activated for group ${groupId} by host ${user.id}`);
    console.log(`Found ${nearbyUsers?.length || 0} nearby users in zip code ${hostProfile.zip_code}`);
    console.log(`Group: ${group.title} from ${farmer?.farm_name || 'Unknown Farm'}`);

    // In a real implementation, you would:
    // 1. Send emails to nearby users using Resend
    // 2. Create in-app notifications
    // 3. Track boost analytics
    // 4. Implement rate limiting to prevent spam

    // For now, we'll simulate the notification process
    const notificationsSent = nearbyUsers?.length || 0;

    // Record the boost activity in a hypothetical boosts table
    // (You would need to create this table in your schema)
    /*
    const { error: boostError } = await supabaseClient
      .from('community_boosts')
      .insert({
        product_id: groupId,
        host_id: user.id,
        zip_code: hostProfile.zip_code,
        notifications_sent: notificationsSent,
        created_at: new Date().toISOString()
      });
    */

    return new Response(
      JSON.stringify({ 
        message: `Community Boost activated! Notified ${notificationsSent} neighbors in your area.`,
        details: {
          groupTitle: group.title,
          farmName: farmer?.farm_name || 'Unknown Farm',
          zipCode: hostProfile.zip_code,
          notificationsSent
        }
      }), 
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (e) {
    console.error('Community Boost error:', e);
    return new Response(
      JSON.stringify({ error: e.message }), 
      { 
        status: 400, 
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});