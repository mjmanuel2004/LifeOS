import { motion } from 'framer-motion';
import LiquidAlert from './LiquidAlert';
import SmartSuggestion from './SmartSuggestion';
import PriorityAlert from './PriorityAlert';
import LiquidCard from '../budget/LiquidCard'; // Fallback / Universal container

// Registry mapping types to components
const WIDGET_REGISTRY = {
    'LIQUID_ALERT': LiquidAlert,
    'SMART_SUGGESTION': SmartSuggestion,
    'PRIORITY_ALERT': PriorityAlert,
    // Future: 'SURVIVAL_SIM': SurvivalSim,
    // Future: 'FOCUS_MODE': FocusMode
};

export default function SmartWidgetEngine({ config }) {
    if (!config || config.length === 0) return null;

    // Sort by priority (ascending: 1 is highest)
    const sortedWidgets = [...config].sort((a, b) => a.priority - b.priority);

    return (
        <div className="space-y-6">
            {sortedWidgets.map((widget) => {
                const Component = WIDGET_REGISTRY[widget.type];

                if (!Component) {
                    console.warn(`Unknown widget type: ${widget.type}`);
                    return null;
                }

                return (
                    <div key={widget.id} className="w-full">
                        <Component data={widget.data} />
                    </div>
                );
            })}
        </div>
    );
}
