import { supabase } from "@/integrations/supabase/client";
import { Channel } from "@/types/finance";

// DB type for channels
interface DbChannel {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string | null;
}

const formatDbChannel = (c: DbChannel): Channel => ({
  id: c.id,
  name: c.name,
  icon: c.icon,
  color: c.color ?? undefined,
});

export const fetchUserChannels = async (userId: string): Promise<Channel[]> => {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;
  return (data as DbChannel[]).map(formatDbChannel);
};

export const addUserChannel = async (
  params: { name: string; icon: string; color?: string },
  userId: string
): Promise<Channel> => {
  const { data, error } = await supabase
    .from('channels')
    .insert({
      user_id: userId,
      name: params.name,
      icon: params.icon,
      color: params.color ?? null,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Insertion réussie mais aucune donnée retournée');
  return formatDbChannel(data as DbChannel);
};

export const updateUserChannel = async (
  channel: Channel,
  userId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('channels')
    .update({
      name: channel.name,
      icon: channel.icon,
      color: channel.color ?? null,
    })
    .eq('id', channel.id)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
};

export const deleteUserChannel = async (
  channelId: string,
  userId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('channels')
    .delete()
    .eq('id', channelId)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
};
