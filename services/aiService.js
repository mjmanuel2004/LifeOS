import { GoogleGenerativeAI } from '@google/generative-ai';
import Revenu from '../models/Revenu.js';
import Depense from '../models/Depense.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeFinancialData = async (userId, month, year) => {
    // 1. Récupérer les données du mois courant et des 2 mois précédents
    const startDate = new Date(year, month - 3, 1); // 2 mois avant
    const endDate = new Date(year, month, 0); // Fin du mois courant

    const [revenus, depenses] = await Promise.all([
        Revenu.find({
            $or: [
                { annee: year, mois: month },
                { annee: year, mois: month - 1 },
                { annee: year, mois: month - 2 },
            ],
        }),
        Depense.find({
            $or: [
                { annee: year, mois: month },
                { annee: year, mois: month - 1 },
                { annee: year, mois: month - 2 },
            ],
        }),
    ]);

    // 2. Préparer le contexte pour l'IA
    const context = {
        currentMonth: `${month}/${year}`,
        revenus: revenus.map((r) => ({
            libelle: r.libelle,
            montant: r.montant,
            date: `${r.mois}/${r.annee}`,
        })),
        depenses: depenses.map((d) => ({
            libelle: d.libelle,
            montant: d.montant,
            categorie: d.categorie,
            date: `${d.day ? d.day + '/' : ''}${d.mois}/${d.annee}`,
        })),
    };

    const prompt = `
    Tu es un expert financier personnel. Analyse les données financières suivantes (revenus et dépenses sur 3 mois) et fournis une réponse structurée en JSON.
    
    Données:
    ${JSON.stringify(context)}

    Ta réponse DOIT être un JSON valide avec la structure suivante (sans markdown, juste le JSON pur) :
    {
      "predictions": "Texte court prédisant la fin du mois basé sur les habitudes (ex: 'Tu risques de dépasser ton budget courses')",
      "alerts": [
        { "category": "NomCategorie", "message": "Message d'alerte spécifique", "severity": "high/medium/low" }
      ],
      "savingsTips": ["Conseil 1", "Conseil 2"],
      "investmentIdeas": ["Idée 1 bas risque", "Idée 2 moyen risque"],
      "financialHealthScore": 0-100 (Score calculé arbitrairement basé sur l'épargne et les dépenses)
    }

    Sois bienveillant mais direct. Donne des conseils actionnables.
  `;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Nettoyage du markdown json si présent
        const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Gemini Error:', error);
        throw new Error("Impossible de générer l'analyse financière avec Gemini pour le moment.");
    }
};

export const analyzeLifeContext = async (context, userPrompt = "") => {
    const prompt = `
    Tu es "Agent Core", l'assistant IA central de LifeOS. Ton rôle est d'être un "Life Architect" proactif, bienveillant et holistique.
    Tu as accès à une vue complète de la vie de l'utilisateur (Finances, Santé, Agenda, Projets).
    
    CONTEXTE ACTUEL (Données Réelles) :
    ${JSON.stringify(context, null, 2)}

    USER PROMPT (Optionnel) : "${userPrompt}"

    TÂCHE :
    Analyse ce contexte global. Si l'utilisateur pose une question, réponds-y en utilisant ces données croisées.
    Si l'utilisateur ne dit rien (Dashboard Briefing), génère un "Briefing" ultra-pertinent.

    RÈGLES DE RÉPONSE :
    1.  **Croise les données** : (ex: "Tu as un gros resto prévu ce soir (Agenda) alors que ton budget Bouffe est critique (Finance), attention.")
    2.  **Ton** : Professionnel mais cool, style "Jarvis/Friday". Tutoiement.
    3.  **Format** : Réponds en JSON pur avec cette structure :
    {
        "greeting": "Phrase d'accroche contextuelle",
        "message": "Le corps du conseil ou de la réponse.",
        "actionItem": "Une action concrète suggérée.",
        "priority": "high" | "normal" | "low",
        "widgetsToHighlight": ["budget" | "calendar" | "sport" | "projets"],
        "lifeBattery": {
            "score": 0-100, // Score global d'énergie/succès
            "status": "Excellent" | "Bon" | "Moyen" | "Critique",
            "physical": 0-100, // Basé sur le sport/santé
            "mental": 0-100, // Basé sur la charge de travail/agenda
            "financial": 0-100 // Basé sur le budget
        }
    }
    `;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Gemini Context Error:', error);
        // Fallback safe response
        return {
            greeting: "Bonjour !",
            message: "Je n'arrive pas à analyser tes données pour le moment, mais je suis là.",
            actionItem: "Check tes notifications",
            priority: "low",
            widgetsToHighlight: [],
            lifeBattery: { score: 75, status: "Moyen", physical: 70, mental: 80, financial: 75 } // Fallback
        };
    }
};
