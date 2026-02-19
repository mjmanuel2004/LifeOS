import { useState, useEffect } from 'react';
import { Dumbbell, Utensils, AlertTriangle } from 'lucide-react';

export default function useCoreIntelligence() {
    const [mood, setMood] = useState('calm'); // 'calm', 'danger', 'focus', 'energy'
    const [dashboardConfig, setDashboardConfig] = useState([]);
    const [greeting, setGreeting] = useState('Bonjour Emmanuel');

    useEffect(() => {
        // Intelligence Logic Loop (Mocked)
        const runAnalysis = () => {
            const hour = new Date().getHours();
            const newConfig = [];

            // 1. Time Context
            if (hour >= 5 && hour < 11) {
                setGreeting('Bon Réveil, Agent Core');
                setMood('energy');
            } else if (hour >= 18) {
                setGreeting('Bonsoir Emmanuel');
                setMood('calm');
            }

            // 2. Mock Logic: "Did Leg Day yesterday?" -> Suggest Recovery
            // In a real app, we would check the 'Sport' history state
            const mockLegDayRecently = true;

            if (mockLegDayRecently && hour < 12) {
                newConfig.push({
                    id: 'recovery_food',
                    type: 'SMART_SUGGESTION',
                    priority: 2,
                    data: {
                        title: 'Récupération Post-Jambes',
                        description: 'Tes muscles ont besoin de protéines ce matin. Suggestion: Omelette ou Poulet.',
                        icon: Utensils,
                        color: 'green'
                    }
                });
            }

            // 3. Mock Logic: "High Priority Crisis" (Simulated for Demo)
            // In production, this would be `budget.resteAVivre < 0`
            const mockCrisis = false; // Set to true to test the full screen overlay

            if (mockCrisis) {
                setMood('danger');
                newConfig.push({
                    id: 'crisis_intervention',
                    type: 'PRIORITY_ALERT',
                    priority: 0, // Top priority
                    data: {
                        title: 'Mode Survie Activé',
                        message: 'Ton solde critique nécessite une intervention immédiate. Toutes les dépenses non-essentielles sont bloquées.',
                        actionLabel: 'Analyser le Budget',
                        severity: 'critical',
                        onAction: () => window.location.href = '/budget', // Simple redirect for now
                    }
                });
            } else {
                // Standard Alert if not full crisis
                const mockBudgetLow = false;
                if (mockBudgetLow) {
                    setMood('danger');
                    newConfig.push({
                        id: 'budget_danger',
                        type: 'LIQUID_ALERT',
                        priority: 1,
                        data: {
                            title: 'Alerte Trésorerie',
                            message: 'Le solde Revolut est critique (< 20€). Activation du mode Survie recommandée.',
                            actionLabel: 'Activer Mode Survie',
                            onAction: () => console.log('Survival Mode Activated')
                        }
                    });
                }
            }

            setDashboardConfig(newConfig);
        };

        runAnalysis();
    }, []);

    return { mood, greeting, dashboardConfig };
}
