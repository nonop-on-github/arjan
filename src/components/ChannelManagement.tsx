
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Channel } from "@/types/finance";
import { X, Edit, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { addUserChannel, updateUserChannel, deleteUserChannel } from "@/services/channelService";

interface ChannelManagementProps {
  open: boolean;
  onClose: () => void;
  channels: Channel[];
  onChannelsUpdate: () => void;
}

const DEFAULT_ICONS = ["💳", "💰", "🏦", "💶", "📱"];
const EMOJI_CATEGORIES = {
  "Argent": ["💰", "💸", "💵", "💴", "💶", "💷", "🏦", "🏧", "💳", "💎", "🪙", "💹"],
  "Transport": ["🚗", "🚕", "🚌", "🚎", "🚓", "🚑", "🚒", "🚚", "🚛", "🚜", "🚲", "🛵", "🏍️", "🚄", "✈️", "🚢"],
  "Nourriture": ["🍕", "🍔", "🍟", "🌭", "🍿", "🧂", "🥓", "🥚", "🍳", "🧇", "🥞", "🧈", "🍞", "🥖", "🥨", "🥯"],
  "Shopping": ["🛒", "👕", "👖", "👗", "👚", "👛", "👜", "👝", "🎒", "👞", "👟", "👠", "👡", "👢", "👑", "💄"],
  "Loisirs": ["🎮", "🎯", "🎲", "🧩", "🎭", "🎬", "🎤", "🎧", "🎼", "🎹", "🎷", "🎺", "🎸", "🪕", "🎻", "🎨"],
  "Maison": ["🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒"],
  "Technologie": ["📱", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "💿", "💾", "📀", "🧮", "📷", "📹", "🎥", "📽️", "📞", "☎️"],
};

export const ChannelManagement = ({ open, onClose, channels, onChannelsUpdate }: ChannelManagementProps) => {
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [newChannel, setNewChannel] = useState<Partial<Channel>>({ name: "", icon: DEFAULT_ICONS[0] });
  const [customEmojiOpen, setCustomEmojiOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAddChannel = async () => {
    if (!user) {
      console.warn("handleAddChannel: no user in context");
      toast({
        title: "Non connecté",
        description: "Veuillez vous reconnecter pour ajouter un canal.",
        variant: "destructive",
      });
      return;
    }
    if (!newChannel.name) {
      toast({
        title: "Erreur",
        description: "Le nom du canal est obligatoire",
        variant: "destructive",
      });
      return;
    }

    try {
      await addUserChannel(
        {
          name: newChannel.name!,
          icon: newChannel.icon || "💳",
          color: newChannel.color,
        },
        user.id
      );

      setNewChannel({ name: "", icon: DEFAULT_ICONS[0] });

      toast({
        title: "Succès",
        description: "Canal ajouté",
      });

      onChannelsUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error adding channel:', error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible d'ajouter le canal",
        variant: "destructive",
      });
    }
  };

  const handleUpdateChannel = async () => {
    if (!user || !editingChannel) return;
    
    try {
      await updateUserChannel(editingChannel, user.id);

      setEditingChannel(null);
      
      toast({
        title: "Succès",
        description: "Canal mis à jour",
      });
      
      onChannelsUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating channel:', error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour le canal",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChannel = async (id: string) => {
    if (!user) return;
    
    try {
      await deleteUserChannel(id, user.id);

      toast({
        title: "Succès",
        description: "Canal supprimé",
      });
      
      onChannelsUpdate();
    } catch (error: any) {
      console.error('Error deleting channel:', error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de supprimer le canal",
        variant: "destructive",
      });
    }
  };

  const selectEmoji = (emoji: string) => {
    if (editingChannel) {
      setEditingChannel({...editingChannel, icon: emoji});
    } else {
      setNewChannel({...newChannel, icon: emoji});
    }
    setCustomEmojiOpen(false);
  };

  const EmojiPicker = () => {
    return (
      <ScrollArea className="h-60 w-full overflow-y-auto pr-4">
        <div className="space-y-4">
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-accent rounded"
                    onClick={() => selectEmoji(emoji)}
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  const renderEmojiSelector = () => {
    if (isMobile) {
      return (
        <Drawer open={customEmojiOpen} onOpenChange={setCustomEmojiOpen}>
          <DrawerTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-lg h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 pt-4 pb-6">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-medium">Sélection d'emoji</h3>
            </div>
            <EmojiPicker />
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Popover open={customEmojiOpen} onOpenChange={setCustomEmojiOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-lg h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="center">
          <EmojiPicker />
        </PopoverContent>
      </Popover>
    );
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
                  {renderEmojiSelector()}
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
