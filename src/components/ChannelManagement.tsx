
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Channel } from "@/types/finance";
import { X, Edit, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

interface ChannelManagementProps {
  open: boolean;
  onClose: () => void;
  channels: Channel[];
  onChannelsUpdate: (channels: Channel[]) => void;
}

const DEFAULT_ICONS = ["💳", "💰", "🏦", "💶", "📱", "🪙", "💎"];

export const ChannelManagement = ({ open, onClose, channels, onChannelsUpdate }: ChannelManagementProps) => {
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [newChannel, setNewChannel] = useState<Partial<Channel>>({ name: "", icon: DEFAULT_ICONS[0] });
  const { toast } = useToast();
  const { user } = useAuthContext();

  const handleAddChannel = async () => {
    if (!user) return;
    if (!newChannel.name) {
      toast({
        title: "Erreur",
        description: "Le nom du canal est obligatoire",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('channels')
        .insert({
          name: newChannel.name,
          icon: newChannel.icon || "💳",
          color: newChannel.color,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        const channel: Channel = {
          id: data.id,
          name: data.name,
          icon: data.icon,
          color: data.color || undefined,
        };
        
        const updatedChannels = [...channels, channel];
        onChannelsUpdate(updatedChannels);
        setNewChannel({ name: "", icon: DEFAULT_ICONS[0] });
        
        toast({
          title: "Succès",
          description: "Canal ajouté",
        });
      }
    } catch (error) {
      console.error('Error adding channel:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le canal",
        variant: "destructive",
      });
    }
  };

  const handleUpdateChannel = async () => {
    if (!user || !editingChannel) return;
    
    try {
      // Correction majeure ici : Assurons-nous d'identifier correctement le canal à mettre à jour
      const { error } = await supabase
        .from('channels')
        .update({
          name: editingChannel.name,
          icon: editingChannel.icon,
          color: editingChannel.color,
        })
        .eq('id', editingChannel.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      // Mise à jour de l'état local avec le canal édité
      const updatedChannels = channels.map((channel) => 
        channel.id === editingChannel.id ? editingChannel : channel
      );
      
      onChannelsUpdate(updatedChannels);
      setEditingChannel(null);
      
      toast({
        title: "Succès",
        description: "Canal mis à jour",
      });
    } catch (error) {
      console.error('Error updating channel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le canal",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChannel = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedChannels = channels.filter((c) => c.id !== id);
      onChannelsUpdate(updatedChannels);
      
      toast({
        title: "Succès",
        description: "Canal supprimé",
      });
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le canal",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gérer mes canaux d'argent</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <h3 className="text-sm font-semibold">Canaux existants</h3>
          
          <div className="space-y-2">
            {channels.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun canal créé</p>
            ) : (
              channels.map((channel) => (
                <div 
                  key={channel.id} 
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{channel.icon}</span>
                    <span>{channel.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setEditingChannel({...channel})}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteChannel(channel.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-2">
              {editingChannel ? "Modifier le canal" : "Ajouter un nouveau canal"}
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input 
                  id="name"
                  value={editingChannel ? editingChannel.name : newChannel.name}
                  onChange={(e) => 
                    editingChannel 
                      ? setEditingChannel({...editingChannel, name: e.target.value})
                      : setNewChannel({...newChannel, name: e.target.value})
                  }
                  placeholder="Ex: Carte principale"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Icône</Label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_ICONS.map((icon) => (
                    <Button
                      key={icon}
                      type="button"
                      variant={
                        (editingChannel && editingChannel.icon === icon) || 
                        (!editingChannel && newChannel.icon === icon) 
                          ? "default" 
                          : "outline"
                      }
                      size="sm"
                      className="text-lg h-10 w-10"
                      onClick={() => 
                        editingChannel 
                          ? setEditingChannel({...editingChannel, icon}) 
                          : setNewChannel({...newChannel, icon})
                      }
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                {editingChannel ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingChannel(null)}
                    >
                      Annuler
                    </Button>
                    <Button onClick={handleUpdateChannel}>
                      Mettre à jour
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddChannel}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelManagement;
