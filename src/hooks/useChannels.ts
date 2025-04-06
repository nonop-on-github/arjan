
import { useState, useEffect } from "react";
import { Channel } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { DbChannel } from "@/types/supabaseTypes";

const DEFAULT_CHANNELS: Channel[] = [
  { id: "default-cash", name: "Espèces", icon: "💰" },
  { id: "default-card", name: "Carte bancaire", icon: "💳" },
];

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const fetchChannels = async () => {
    if (!user) {
      setChannels(DEFAULT_CHANNELS);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedChannels: Channel[] = (data as DbChannel[]).map(c => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          color: c.color || undefined,
        }));
        setChannels(formattedChannels);
      } else {
        // Si l'utilisateur n'a pas encore de canaux, créons les canaux par défaut
        const defaultChannelsWithUserId = DEFAULT_CHANNELS.map(channel => ({
          name: channel.name,
          icon: channel.icon,
          user_id: user.id
        }));

        const { error: insertError } = await supabase
          .from('channels')
          .insert(defaultChannelsWithUserId);

        if (insertError) throw insertError;

        // Récupérer les canaux fraîchement créés
        const { data: newChannels } = await supabase
          .from('channels')
          .select('*')
          .eq('user_id', user.id);

        if (newChannels && newChannels.length > 0) {
          const formattedNewChannels: Channel[] = (newChannels as DbChannel[]).map(c => ({
            id: c.id,
            name: c.name,
            icon: c.icon,
            color: c.color || undefined,
          }));
          setChannels(formattedNewChannels);
        } else {
          setChannels(DEFAULT_CHANNELS);
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les canaux",
        variant: "destructive",
      });
      // Utiliser les canaux par défaut en cas d'erreur
      setChannels(DEFAULT_CHANNELS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [user]);

  return {
    channels,
    isLoading,
    setChannels,
    refreshChannels: fetchChannels,
  };
};
