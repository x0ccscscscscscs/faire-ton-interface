import { Bot, Users, MessageSquare, Activity, Zap, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const mockStats = {
    tokens: { active: 0, total: 0 },
    targets: 0,
    messages: { sent: 0, pending: 0 },
    success_rate: 0
  };

  const recentActivity = [
    {
      type: "info",
      message: "Bienvenue dans le gestionnaire Discord",
      time: "Il y a quelques instants"
    }
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre gestionnaire multi-tokens Discord
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tokens Actifs"
          value={`${mockStats.tokens.active}/${mockStats.tokens.total}`}
          description="Tokens connectés"
          icon={<Bot className="h-4 w-4" />}
          trend={{ value: 0, isPositive: true }}
        />
        
        <StatsCard
          title="IDs Cibles"
          value={mockStats.targets}
          description="Utilisateurs ciblés"
          icon={<Users className="h-4 w-4" />}
        />
        
        <StatsCard
          title="Messages Envoyés"
          value={mockStats.messages.sent}
          description={`${mockStats.messages.pending} en attente`}
          icon={<MessageSquare className="h-4 w-4" />}
          trend={{ value: 0, isPositive: true }}
        />
        
        <StatsCard
          title="Taux de Succès"
          value={`${mockStats.success_rate}%`}
          description="Dernières 24h"
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Commencez par configurer vos tokens et IDs cibles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="discord" 
              className="w-full justify-start"
              onClick={() => window.location.href = "/tokens"}
            >
              <Bot className="h-4 w-4" />
              Gérer les Tokens
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = "/targets"}
            >
              <Users className="h-4 w-4" />
              Gérer les IDs Cibles
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = "/messages"}
            >
              <MessageSquare className="h-4 w-4" />
              Envoyer des DMs
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activité Récente
            </CardTitle>
            <CardDescription>
              Dernières actions et événements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
              
              {recentActivity.length === 1 && (
                <div className="text-center py-4">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Commencez par ajouter des tokens pour voir l'activité
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning Notice */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Configuration Requise</h3>
              <p className="text-sm text-muted-foreground">
                Pour utiliser pleinement cette interface, vous devrez connecter votre projet à Supabase 
                pour gérer les tokens, la base de données et les fonctionnalités backend.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}