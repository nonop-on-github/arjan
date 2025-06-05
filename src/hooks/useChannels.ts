import { useState, useEffect } from "react";
import { Channel } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { DbChannel } from "@/types/supabaseTypes";

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const fetchChannels = async () => {
    if (!user) {
      setChannels([]);
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
        // No automatic creation of default channels - keep empty array
        setChannels([]);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les canaux",
        variant: "destructive",
      });
      setChannels([]);
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
