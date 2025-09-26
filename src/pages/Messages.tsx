import { useState } from "react";
import { Send, MessageSquare, Play, TestTube, Calendar, Users, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface Campaign {
  id: string;
  name: string;
  message: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  sent: number;
  total: number;
  success_rate: number;
  created_at: string;
}

export default function Messages() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const { toast } = useToast();

  // Mock data
  const mockStats = {
    total_sent: 0,
    success_rate: 0,
    active_campaigns: 0,
    pending_messages: 0
  };

  const handleCreateCampaign = () => {
    if (!message.trim() || !campaignName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignName,
      message: message,
      status: 'draft',
      sent: 0,
      total: 100, // Mock total
      success_rate: 0,
      created_at: new Date().toLocaleString()
    };

    setCampaigns([...campaigns, newCampaign]);
    setMessage("");
    setCampaignName("");
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Campagne créée",
      description: `Campagne "${campaignName}" créée avec succès`,
    });
  };

  const handleStartCampaign = (id: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: 'running' as const }
        : campaign
    ));
    
    toast({
      title: "Campagne démarrée",
      description: "L'envoi des messages a commencé",
    });
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const variants = {
      draft: { variant: "secondary" as const, text: "Brouillon", class: "" },
      running: { variant: "default" as const, text: "En cours", class: "bg-primary text-primary-foreground" },
      completed: { variant: "default" as const, text: "Terminé", class: "bg-success text-success-foreground" },
      paused: { variant: "default" as const, text: "En pause", class: "bg-warning text-warning-foreground" }
    };
    
    const config = variants[status];
    return (
      <Badge 
        variant={config.variant}
        className={config.class}
      >
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Envoi de DMs
          </h1>
          <p className="text-muted-foreground">
            Gérez vos campagnes de messages Discord
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <TestTube className="h-4 w-4" />
            Test
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="discord">
                <Send className="h-4 w-4" />
                Nouvelle Campagne
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une campagne de DMs</DialogTitle>
                <DialogDescription>
                  Configurez votre message qui sera envoyé à tous les IDs cibles
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaignName">Nom de la campagne</Label>
                  <Textarea
                    id="campaignName"
                    placeholder="Ex: Campagne Promotion Produit"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    rows={1}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tapez votre message ici..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.length}/2000 caractères
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Aperçu de l'envoi :</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Tokens disponibles: 0</p>
                    <p>• IDs cibles: 0</p>
                    <p>• Messages à envoyer: 0</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleCreateCampaign} className="flex-1">
                    Créer la campagne
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockStats.total_sent}</p>
                <p className="text-sm text-muted-foreground">Messages envoyés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockStats.success_rate}%</p>
                <p className="text-sm text-muted-foreground">Taux de succès</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Play className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockStats.active_campaigns}</p>
                <p className="text-sm text-muted-foreground">Campagnes actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockStats.pending_messages}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Campagnes de Messages</CardTitle>
          <CardDescription>
            Historique et gestion de vos campagnes ({campaigns.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucune campagne</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre première campagne pour commencer à envoyer des DMs
              </p>
              <Button variant="discord" onClick={() => setIsCreateDialogOpen(true)}>
                <Send className="h-4 w-4" />
                Créer une campagne
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Taux de succès</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <div className="max-w-48 truncate text-muted-foreground">
                          {campaign.message}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{campaign.sent}</span>
                            <span>{campaign.total}</span>
                          </div>
                          <Progress 
                            value={(campaign.sent / campaign.total) * 100} 
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {campaign.success_rate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {campaign.created_at}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {campaign.status === 'draft' && (
                            <Button 
                              size="sm" 
                              variant="discord"
                              onClick={() => handleStartCampaign(campaign.id)}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Voir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              Test Rapide
            </CardTitle>
            <CardDescription>
              Envoyez un message de test à un ID spécifique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="ID Discord (ex: 123456789012345678)"
              rows={1}
            />
            <Textarea
              placeholder="Message de test..."
              rows={3}
            />
            <Button variant="outline" className="w-full">
              <Send className="h-4 w-4" />
              Envoyer Test
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Prérequis
            </CardTitle>
            <CardDescription>
              Vérifiez votre configuration avant l'envoi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tokens configurés</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">IDs cibles</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Connexions actives</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4" />
              Vérifier Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}