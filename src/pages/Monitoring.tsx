import { Activity, Zap, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ConnectionStatus {
  id: string;
  name: string;
  type: 'bot' | 'user';
  status: 'online' | 'offline' | 'error';
  ping: number;
  lastActivity: string;
  messages_sent: number;
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

export default function Monitoring() {
  // Mock data
  const connections: ConnectionStatus[] = [];
  
  const systemMetrics: SystemMetric[] = [
    { name: "CPU Usage", value: 15, unit: "%", status: "good", description: "Processeur" },
    { name: "RAM Usage", value: 45, unit: "%", status: "good", description: "Mémoire vive" },
    { name: "Rate Limit", value: 80, unit: "%", status: "warning", description: "Limite API Discord" },
    { name: "Latency", value: 120, unit: "ms", status: "good", description: "Latence réseau" }
  ];

  const recentLogs = [
    {
      timestamp: new Date().toLocaleTimeString(),
      level: "info",
      message: "Application démarrée avec succès",
      source: "System"
    }
  ];

  const getStatusBadge = (status: ConnectionStatus['status']) => {
    const variants = {
      online: { variant: "default" as const, text: "En ligne", class: "bg-success text-success-foreground" },
      offline: { variant: "secondary" as const, text: "Hors ligne", class: "" },
      error: { variant: "destructive" as const, text: "Erreur", class: "" }
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

  const getMetricColor = (status: SystemMetric['status']) => {
    return {
      good: "text-success",
      warning: "text-warning", 
      critical: "text-destructive"
    }[status];
  };

  const getMetricIcon = (status: SystemMetric['status']) => {
    const icons = {
      good: CheckCircle,
      warning: AlertTriangle,
      critical: XCircle
    };
    const Icon = icons[status];
    return <Icon className={`h-4 w-4 ${getMetricColor(status)}`} />;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Monitoring
          </h1>
          <p className="text-muted-foreground">
            Surveillez les performances et la santé du système
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Activity className="h-4 w-4" />
            Rafraîchir
          </Button>
          <Button variant="discord">
            <Zap className="h-4 w-4" />
            Tests Connexion
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric) => (
          <Card key={metric.name} className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.name}</span>
                {getMetricIcon(metric.status)}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}{metric.unit}
                </div>
                <Progress 
                  value={metric.value} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connections Status */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            État des Connexions
          </CardTitle>
          <CardDescription>
            Statut en temps réel de vos tokens Discord ({connections.length} actifs)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucune connexion active</h3>
              <p className="text-muted-foreground mb-4">
                Configurez des tokens pour voir leur statut de connexion
              </p>
              <Button variant="outline" onClick={() => window.location.href = "/tokens"}>
                <Zap className="h-4 w-4" />
                Gérer les Tokens
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Ping</TableHead>
                    <TableHead>Messages envoyés</TableHead>
                    <TableHead>Dernière activité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connections.map((connection) => (
                    <TableRow key={connection.id}>
                      <TableCell className="font-medium">{connection.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {connection.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(connection.status)}</TableCell>
                      <TableCell>
                        <span className={connection.ping < 200 ? "text-success" : "text-warning"}>
                          {connection.ping}ms
                        </span>
                      </TableCell>
                      <TableCell>{connection.messages_sent}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {connection.lastActivity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Logs Récents
            </CardTitle>
            <CardDescription>
              Dernières activités du système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{log.message}</p>
                    <p className="text-xs text-muted-foreground">Source: {log.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertes & Notifications
            </CardTitle>
            <CardDescription>
              Problèmes détectés et recommandations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-warning/20 bg-warning/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Configuration incomplète</h4>
                    <p className="text-sm text-muted-foreground">
                      Aucun token Discord configuré. Ajoutez des tokens pour commencer.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Configurer
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-muted bg-muted/5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Système opérationnel</h4>
                    <p className="text-sm text-muted-foreground">
                      Tous les services fonctionnent normalement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Graphiques de Performance
          </CardTitle>
          <CardDescription>
            Métriques de performance sur les dernières 24h
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Graphiques en développement</h3>
              <p className="text-muted-foreground">
                Les graphiques de performance seront disponibles prochainement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}